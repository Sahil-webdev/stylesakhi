import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import User from '@/models/User';
import { generatePasswordResetToken, generateToken, verifyPasswordResetToken } from '@/utils/jwt';
import { sendSuccess, sendError, sendValidationError, sendUnauthorized } from '@/utils/response';
import { authenticate, authenticateAdmin } from '@/middleware/auth';
import { getDefaultPermissionsByRole, resolvePermissions, type AdminRole } from '@/utils/adminRbac';
import { sendAdminOtpEmail } from '@/utils/mailer';

const router = Router();
const ADMIN_ROLES = ['admin', 'super_admin', 'manager', 'staff'] as const;
const OTP_EXPIRY_MS = 10 * 60 * 1000;

const hashOtp = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

/**
 * GET /api/auth/admin/setup-status
 * Check whether one-time super admin setup is still available
 */
router.get('/admin/setup-status', async (_req: Request, res: Response) => {
  try {
    const superAdminCount = await User.countDocuments({ role: 'super_admin' });

    return sendSuccess(res, {
      setupRequired: superAdminCount === 0,
      hasSuperAdmin: superAdminCount > 0,
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to check admin setup status', 500);
  }
});

/**
 * POST /api/auth/admin/setup-super-admin
 * One-time setup for first super admin
 */
router.post('/admin/setup-super-admin', async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    const errors: Record<string, string> = {};
    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const normalizedPhone = String(phone || '').trim();
    const rawPassword = String(password || '');
    const rawConfirmPassword = String(confirmPassword || '');

    if (await User.exists({ role: 'super_admin' })) {
      return sendError(res, 'Super admin setup is already completed', 409);
    }

    if (normalizedName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = 'Please provide a valid email';
    }

    if (!normalizedPhone || !/^\+?[0-9\s-]{10,15}$/.test(normalizedPhone)) {
      errors.phone = 'Please provide a valid mobile number';
    }

    if (rawPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (rawConfirmPassword !== rawPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 409);
    }

    const superAdmin = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: rawPassword,
      phone: normalizedPhone,
      role: 'super_admin',
      isActive: true,
      isVerified: true,
      adminPermissions: getDefaultPermissionsByRole('super_admin'),
    });

    return sendSuccess(
      res,
      {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        phone: superAdmin.phone,
        role: superAdmin.role,
      },
      'Super admin created successfully',
      201,
    );
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return sendError(res, error.message || 'Failed to create super admin', 500);
  }
});

/**
 * POST /api/auth/admin/forgot-password/request-otp
 */
router.post('/admin/forgot-password/request-otp', async (req: Request, res: Response) => {
  try {
    const normalizedEmail = String(req.body?.email || '').toLowerCase().trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return sendValidationError(res, {
        email: 'Please provide a valid email address',
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
      role: { $in: [...ADMIN_ROLES] },
    }).select('+passwordResetOtpHash +passwordResetOtpExpiresAt');

    if (!user) {
      return sendError(res, 'No admin account found with this email address', 404);
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.passwordResetOtpHash = hashOtp(otp);
    user.passwordResetOtpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    await user.save();

    await sendAdminOtpEmail({
      email: user.email,
      otp,
      name: user.name,
    });

    return sendSuccess(res, {
      step: 'otp_sent',
      email: user.email,
    }, 'OTP sent successfully');
  } catch (error: any) {
    console.error('Forgot password OTP send error:', error);
    return sendError(res, error.message || 'Failed to send OTP', 500);
  }
});

/**
 * POST /api/auth/admin/forgot-password/verify-otp
 */
router.post('/admin/forgot-password/verify-otp', async (req: Request, res: Response) => {
  try {
    const normalizedEmail = String(req.body?.email || '').toLowerCase().trim();
    const otp = String(req.body?.otp || '').trim();

    const errors: Record<string, string> = {};
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!/^\d{6}$/.test(otp)) {
      errors.otp = 'Please enter a valid 6-digit OTP';
    }
    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const user = await User.findOne({
      email: normalizedEmail,
      role: { $in: [...ADMIN_ROLES] },
    }).select('+passwordResetOtpHash +passwordResetOtpExpiresAt');

    if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return sendError(res, 'OTP request not found. Please request a new OTP.', 400);
    }

    if (user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
      user.passwordResetOtpHash = undefined;
      user.passwordResetOtpExpiresAt = undefined;
      await user.save();
      return sendError(res, 'OTP has expired. Please request a new OTP.', 400);
    }

    if (user.passwordResetOtpHash !== hashOtp(otp)) {
      return sendError(res, 'Invalid OTP. Please try again.', 400);
    }

    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpiresAt = undefined;
    await user.save();

    const resetToken = generatePasswordResetToken({
      userId: user._id.toString(),
      email: user.email,
      purpose: 'admin_password_reset',
    });

    return sendSuccess(res, {
      step: 'otp_verified',
      resetToken,
    }, 'OTP verified successfully');
  } catch (error: any) {
    console.error('Forgot password OTP verify error:', error);
    return sendError(res, error.message || 'Failed to verify OTP', 500);
  }
});

/**
 * POST /api/auth/admin/forgot-password/reset
 */
router.post('/admin/forgot-password/reset', async (req: Request, res: Response) => {
  try {
    const normalizedEmail = String(req.body?.email || '').toLowerCase().trim();
    const newPassword = String(req.body?.newPassword || '');
    const confirmPassword = String(req.body?.confirmPassword || '');
    const resetToken = String(req.body?.resetToken || '').trim();

    const errors: Record<string, string> = {};
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = 'Please provide a valid email address';
    }
    if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!resetToken) {
      errors.resetToken = 'Reset token is required';
    }
    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    const tokenPayload = verifyPasswordResetToken(resetToken);
    if (!tokenPayload || tokenPayload.purpose !== 'admin_password_reset') {
      return sendError(res, 'Reset session is invalid or expired', 401);
    }

    if (tokenPayload.email !== normalizedEmail) {
      return sendError(res, 'Reset session does not match this email address', 401);
    }

    const user = await User.findOne({
      _id: tokenPayload.userId,
      email: normalizedEmail,
      role: { $in: [...ADMIN_ROLES] },
    }).select('+password');

    if (!user) {
      return sendError(res, 'Admin account not found', 404);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, {
      step: 'password_reset',
    }, 'Password reset successful');
  } catch (error: any) {
    console.error('Forgot password reset error:', error);
    return sendError(res, error.message || 'Failed to reset password', 500);
  }
});

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

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    if (!ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number])) {
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
