import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, TokenPayload } from '@/utils/jwt';
import { sendUnauthorized, sendForbidden } from '@/utils/response';
import { resolvePermissions, type PermissionModule, type AdminPermission, type AdminRole } from '@/utils/adminRbac';
import User from '@/models/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload & { _id: string };
      adminPermissions?: AdminPermission[];
    }
  }
}

/**
 * Authentication middleware - Verifies JWT token
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return sendUnauthorized(res, 'Please provide authentication token');
    }

    const payload = verifyToken(token);

    if (!payload) {
      return sendUnauthorized(res, 'Invalid or expired token');
    }

    // Verify user still exists in database
    const user = await User.findById(payload.userId).select('-password');

    if (!user) {
      return sendUnauthorized(res, 'User no longer exists');
    }

    // Attach user to request
    req.user = {
      ...payload,
      _id: user._id.toString(),
    };

    return next();
  } catch (error: any) {
    return sendUnauthorized(res, 'Authentication failed');
  }
}

/**
 * Admin authorization middleware - Checks if user is admin
 */
export function authorizeAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return sendUnauthorized(res, 'Authentication required');
  }

  if (!['admin', 'super_admin', 'manager', 'staff'].includes(req.user.role)) {
    return sendForbidden(res, 'Admin access required');
  }

  return next();
}

/**
 * Combined auth middleware - Authenticate + Admin check
 */
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  authenticate(req, res, (err?: any) => {
    if (err) return;
    authorizeAdmin(req, res, async () => {
      const currentUser = await User.findById(req.user?.userId)
        .select('role adminPermissions')
        .lean();

      const role = ((currentUser?.role as any) || 'staff') as AdminRole;
      req.adminPermissions = resolvePermissions(role, (currentUser as any)?.adminPermissions || []);
      next();
    });
  });
}

export function authorizeModule(module: PermissionModule, action: keyof Omit<AdminPermission, 'module'> = 'can_view') {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissions = req.adminPermissions || [];
    const permission = permissions.find((p) => p.module === module);
    if (!permission || !permission[action]) {
      return sendForbidden(res, 'You do not have access to this module');
    }
    return next();
  };
}
