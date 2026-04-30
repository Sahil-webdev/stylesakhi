import { Router } from 'express';
import { authenticateAdmin } from '@/middleware/auth';

/**
 * Category routes
 * Base URL: /api/categories
 * 
 * Endpoints from client/app/api/categories:
 * - GET    /                - Get all categories (public)
 * - GET    /:id             - Get single category (public)
 * - POST   /                - Create category (admin)
 * - PUT    /:id             - Update category (admin)
 * - DELETE /:id             - Delete category (admin)
 */

const router = Router();

// Public routes
router.get('/', (_req, res) => {
  // TODO: Implement - See client/app/api/categories/route.ts
  res.json({ message: 'Get categories endpoint - TODO' });
});

router.get('/:id', (_req, res) => {
  // TODO: Implement - See client/app/api/categories/[id]/route.ts
  res.json({ message: 'Get category endpoint - TODO' });
});

// Admin routes
router.post('/', authenticateAdmin, (_req, res) => {
  // TODO: Implement - See client/app/api/categories/route.ts
  res.json({ message: 'Create category endpoint - TODO' });
});

router.put('/:id', authenticateAdmin, (_req, res) => {
  // TODO: Implement - See client/app/api/categories/[id]/route.ts
  res.json({ message: 'Update category endpoint - TODO' });
});

router.delete('/:id', authenticateAdmin, (_req, res) => {
  // TODO: Implement - See client/app/api/categories/[id]/route.ts
  res.json({ message: 'Delete category endpoint - TODO' });
});

export default router;
