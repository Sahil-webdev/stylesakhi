import { Router, Request, Response } from 'express';
import User from '@/models/User';
import { generateToken } from '@/utils/jwt';
import { sendSuccess, sendError, sendValidationError, sendUnauthorized } from '@/utils/response';
import { authenticate, authenticateAdmin } from '@/middleware/auth';
import { getDefaultPermissionsByRole, resolvePermissions, type AdminRole } from '@/utils/adminRbac';

const router = Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    const errors: Record<string, string> = {};
    
    if (!name || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 409);
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone,
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          isVerified: user.isVerified,
          isActive: user.isActive,
        },
      },
      'User registered successfully',
      201
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return sendError(res, error.message || 'Registration failed', 500);
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendValidationError(res, {
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : '',
      });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    if (!user.isActive) {
      return sendUnauthorized(res, 'Your account is disabled. Please contact support.');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.lastLoginAt = new Date();
    await user.save();

    return sendSuccess(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isActive: user.isActive,
      },
    }, 'Login successful');
  } catch (error: any) {
    console.error('Login error:', error);
    return sendError(res, error.message || 'Login failed', 500);
  }
});

/**
 * POST /api/auth/admin/login
 * Login admin user with RBAC payload
 */
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendValidationError(res, {
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : '',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const inputPassword = String(password);

    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Bootstrap super admin from env on first login if not exists
    if (!user) {
      const superEmail = String(process.env.ADMIN_EMAIL || 'admin@stylesakhi.com').toLowerCase().trim();
      const superPassword = String(process.env.ADMIN_PASSWORD || 'Admin@123');
      const superName = String(process.env.ADMIN_NAME || 'StyleSakhi Super Admin');

      if (normalizedEmail === superEmail && inputPassword === superPassword) {
        user = await User.create({
          name: superName,
          email: superEmail,
          password: superPassword,
          role: 'super_admin',
          isActive: true,
          isVerified: true,
          adminPermissions: getDefaultPermissionsByRole('super_admin'),
        });
        user = await User.findById(user._id).select('+password');
      }
    }

    if (!user) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    if (!['admin', 'super_admin', 'manager', 'staff'].includes(String(user.role))) {
      return sendUnauthorized(res, 'You are not allowed to access admin panel');
    }

    if (!user.isActive) {
      return sendUnauthorized(res, 'Your admin account is disabled');
    }

    const validPassword = await user.comparePassword(inputPassword);
    if (!validPassword) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    const role = user.role as AdminRole;
    const permissions = resolvePermissions(role, user.adminPermissions as any);

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: role,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role,
          permissions,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
        },
      },
      'Admin login successful',
    );
  } catch (error: any) {
    console.error('Admin login error:', error);
    return sendError(res, error.message || 'Admin login failed', 500);
  }
});

/**
 * GET /api/auth/admin/me
 */
router.get('/admin/me', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password').lean();
    if (!user) {
      return sendUnauthorized(res, 'User not found');
    }

    const role = user.role as AdminRole;
    const permissions = resolvePermissions(role, (user as any).adminPermissions || []);

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role,
      permissions,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch admin profile', 500);
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');

    if (!user) {
      return sendUnauthorized(res, 'User not found');
    }

    return sendSuccess(res, user);
  } catch (error: any) {
    console.error('Get user error:', error);
    return sendError(res, error.message || 'Failed to fetch user', 500);
  }
});

export default router;
