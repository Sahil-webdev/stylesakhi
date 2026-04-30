import { Router, Request, Response } from 'express';
import { authenticate } from '@/middleware/auth';
import User from '@/models/User';
import { sendSuccess, sendError, sendValidationError } from '@/utils/response';

/**
 * User routes
 * Base URL: /api/user
 * 
 * Endpoints from client/app/api/user:
 * - GET    /profile         - Get user profile
 * - PUT    /profile         - Update user profile  
 * - GET    /addresses       - Get all addresses
 * - POST   /addresses       - Create new address
 * - PUT    /addresses/:id   - Update address
 * - DELETE /addresses/:id   - Delete address
 */

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId).select('-password');
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return sendError(res, error.message || 'Failed to fetch profile', 500);
  }
});

router.put('/profile', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender, address } = req.body;

    // Validation
    const errors: Record<string, string> = {};
    
    if (firstName && firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (lastName && lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (phone && phone.trim().length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      errors.gender = 'Invalid gender value';
    }

    if (Object.keys(errors).length > 0) {
      return sendValidationError(res, errors);
    }

    // Update user profile
    const user = await User.findById(req.user!.userId);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address.trim();

    await user.save();

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      updatedAt: user.updatedAt,
    }, 'Profile updated successfully');
  } catch (error: any) {
    console.error('Update profile error:', error);
    return sendError(res, error.message || 'Failed to update profile', 500);
  }
});

// Address routes
router.get('/addresses', (_req, res) => {
  // TODO: Implement - See client/app/api/user/addresses/route.ts
  res.json({ message: 'Get addresses endpoint - TODO' });
});

router.post('/addresses', (_req, res) => {
  // TODO: Implement - See client/app/api/user/addresses/route.ts
  res.json({ message: 'Create address endpoint - TODO' });
});

router.put('/addresses/:id', (_req, res) => {
  // TODO: Implement - See client/app/api/user/addresses/[id]/route.ts
  res.json({ message: 'Update address endpoint - TODO' });
});

router.delete('/addresses/:id', (_req, res) => {
  // TODO: Implement - See client/app/api/user/addresses/[id]/route.ts
  res.json({ message: 'Delete address endpoint - TODO' });
});

export default router;
