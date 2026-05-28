import { Router } from 'express';
import multer from 'multer';
import { authenticateAdmin } from '@/middleware/auth';
import { destroyMediaByPublicId, storeUploadedMediaFile } from '@/utils/cloudinary';
import { sendError, sendServerError, sendSuccess } from '@/utils/response';

const router = Router();

type UploadKind = 'product-image' | 'product-video' | 'banner-image';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.MEDIA_UPLOAD_MAX_BYTES || 120 * 1024 * 1024),
  },
});

const folderByKind: Record<UploadKind, string> = {
  'product-image': 'products/images',
  'product-video': 'products/videos',
  'banner-image': 'banners',
};

const mediaTypeByKind: Record<UploadKind, 'image' | 'video'> = {
  'product-image': 'image',
  'product-video': 'video',
  'banner-image': 'image',
};

const hasModulePermission = (
  req: Express.Request,
  module: 'products' | 'settings',
  actions: Array<'can_create' | 'can_edit' | 'can_delete'>,
) => {
  const permission = (req.adminPermissions || []).find((item) => item.module === module);
  if (!permission) return false;
  return actions.some((action) => Boolean(permission[action]));
};

const ensureKind = (value: unknown): UploadKind | null => {
  if (typeof value !== 'string') return null;
  if (value === 'product-image' || value === 'product-video' || value === 'banner-image') return value;
  return null;
};

router.use(authenticateAdmin);

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const kind = ensureKind(req.body?.kind);
    if (!kind) {
      return sendError(res, 'Invalid upload kind');
    }

    if (
      (kind === 'product-image' || kind === 'product-video') &&
      !hasModulePermission(req, 'products', ['can_create', 'can_edit'])
    ) {
      return sendError(res, 'You do not have permission to upload product media', 403);
    }

    if (kind === 'banner-image' && !hasModulePermission(req, 'settings', ['can_edit'])) {
      return sendError(res, 'You do not have permission to upload banner media', 403);
    }

    const file = req.file;
    if (!file) {
      return sendError(res, 'File is required');
    }

    const mediaType = mediaTypeByKind[kind];
    if (mediaType === 'image' && !file.mimetype.startsWith('image/')) {
      return sendError(res, 'Only image files are allowed for this upload');
    }
    if (mediaType === 'video' && !file.mimetype.startsWith('video/')) {
      return sendError(res, 'Only video files are allowed for this upload');
    }

    const stored = await storeUploadedMediaFile(file.buffer, file.mimetype, mediaType, folderByKind[kind]);

    return sendSuccess(
      res,
      {
        kind,
        ...stored,
      },
      'Media uploaded successfully',
      201,
    );
  } catch (_error) {
    return sendServerError(res, 'Failed to upload media');
  }
});

router.post('/delete', async (req, res) => {
  try {
    const publicId = typeof req.body?.publicId === 'string' ? req.body.publicId.trim() : '';
    if (!publicId) {
      return sendError(res, 'publicId is required');
    }

    const canManageProducts = hasModulePermission(req, 'products', ['can_create', 'can_edit', 'can_delete']);
    const canManageSettings = hasModulePermission(req, 'settings', ['can_edit']);
    if (!canManageProducts && !canManageSettings) {
      return sendError(res, 'You do not have permission to delete media', 403);
    }

    await Promise.allSettled([
      destroyMediaByPublicId(publicId, 'image'),
      destroyMediaByPublicId(publicId, 'video'),
    ]);

    return sendSuccess(res, { publicId }, 'Media deleted successfully');
  } catch (_error) {
    return sendServerError(res, 'Failed to delete media');
  }
});

export default router;
