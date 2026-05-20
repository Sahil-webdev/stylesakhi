import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

type CloudinaryResourceType = 'image' | 'video';

export type UploadedMediaResult = {
  url: string;
  publicId: string | null;
  uploaded: boolean;
};

const CLOUDINARY_CLOUD_NAME = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const CLOUDINARY_API_KEY = (process.env.CLOUDINARY_API_KEY || '').trim();
const CLOUDINARY_API_SECRET = (process.env.CLOUDINARY_API_SECRET || '').trim();

const isConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

if (isConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export const cloudinaryReady = () => isConfigured;

export const isDataUri = (value: string) => /^data:[^;]+;base64,/.test(value);

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

export const uploadProductMedia = async (
  source: string,
  resourceType: CloudinaryResourceType,
  folder: string,
): Promise<UploadedMediaResult> => {
  const normalized = source.trim();
  if (!normalized) return { url: '', publicId: null, uploaded: false };

  if (isDataUri(normalized)) {
    if (!isConfigured) {
      throw new Error(
        'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend .env',
      );
    }

    const options: UploadApiOptions = {
      folder,
      resource_type: resourceType,
      overwrite: true,
      unique_filename: true,
    };
    const result = await cloudinary.uploader.upload(normalized, options);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      uploaded: true,
    };
  }

  if (isHttpUrl(normalized)) {
    return { url: normalized, publicId: null, uploaded: false };
  }

  return { url: normalized, publicId: null, uploaded: false };
};

export const destroyMediaByPublicId = async (
  publicId: string,
  resourceType: CloudinaryResourceType,
): Promise<void> => {
  const normalized = publicId.trim();
  if (!normalized || !isConfigured) return;
  await cloudinary.uploader.destroy(normalized, { resource_type: resourceType, invalidate: true });
};

