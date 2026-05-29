import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

type CloudinaryResourceType = 'image' | 'video';
type StorageDriver = 'local' | 'r2' | 'auto';

export type UploadedMediaResult = {
  url: string;
  publicId: string | null;
  uploaded: boolean;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
};

export type StoredMediaFileResult = UploadedMediaResult;

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT_DIR = path.resolve(MODULE_DIR, '../../');
const resolveMediaRootDir = () => {
  const configured = (process.env.MEDIA_ROOT_DIR || '').trim();
  if (!configured) {
    const backendMediaDir = path.resolve(BACKEND_ROOT_DIR, 'media');
    const cwdMediaDir = path.resolve(process.cwd(), 'media');
    if (cwdMediaDir !== backendMediaDir && existsSync(cwdMediaDir)) {
      return cwdMediaDir;
    }
    return backendMediaDir;
  }
  if (path.isAbsolute(configured)) {
    return configured;
  }
  return path.resolve(BACKEND_ROOT_DIR, configured);
};
const MEDIA_ROOT_DIR = resolveMediaRootDir();
const MEDIA_URL_PREFIX = (() => {
  const raw = (process.env.MEDIA_URL_PREFIX || '/media').trim();
  if (!raw) return '/media';
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  return withLeading.replace(/\/+$/, '');
})();
const normalizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, '');

const isLocalBaseUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
  } catch {
    return false;
  }
};

const FALLBACK_PUBLIC_URL = normalizeBaseUrl(process.env.DEFAULT_PUBLIC_BASE_URL || 'https://stylesakhi.com');
const configuredPublicUrl = normalizeBaseUrl(
  (process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || '5000'}`).trim() ||
    `http://localhost:${process.env.PORT || '5000'}`,
);
const BACKEND_PUBLIC_URL =
  process.env.NODE_ENV === 'production' && isLocalBaseUrl(configuredPublicUrl)
    ? FALLBACK_PUBLIC_URL
    : configuredPublicUrl;

const normalizeStorageDriver = (value: string): StorageDriver => {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'local' || normalized === 'r2' || normalized === 'auto') return normalized;
  return 'auto';
};

const STORAGE_DRIVER = normalizeStorageDriver(process.env.MEDIA_STORAGE_DRIVER || 'auto');

const R2_ACCOUNT_ID = (process.env.R2_ACCOUNT_ID || '').trim();
const R2_BUCKET = (process.env.R2_BUCKET || '').trim();
const R2_ACCESS_KEY_ID = (process.env.R2_ACCESS_KEY_ID || '').trim();
const R2_SECRET_ACCESS_KEY = (process.env.R2_SECRET_ACCESS_KEY || '').trim();
const R2_REGION = (process.env.R2_REGION || 'auto').trim() || 'auto';
const R2_S3_ENDPOINT = (() => {
  const raw = (process.env.R2_S3_ENDPOINT || '').trim();
  if (raw) return raw.replace(/\/+$/, '');
  if (!R2_ACCOUNT_ID) return '';
  return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
})();
const R2_PUBLIC_BASE_URL = ((process.env.R2_PUBLIC_BASE_URL || '').trim() || '').replace(/\/+$/, '');
const R2_FORCE_PATH_STYLE = (process.env.R2_FORCE_PATH_STYLE || 'true').trim().toLowerCase() !== 'false';

const hasR2Config = Boolean(R2_S3_ENDPOINT && R2_BUCKET && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
const usingR2 = STORAGE_DRIVER === 'r2' || (STORAGE_DRIVER === 'auto' && hasR2Config);

let s3Client: S3Client | null = null;

const getS3Client = () => {
  if (!usingR2) return null;
  if (!hasR2Config) {
    throw new Error('R2 storage is enabled but required env vars are missing');
  }
  if (s3Client) return s3Client;
  s3Client = new S3Client({
    region: R2_REGION,
    endpoint: R2_S3_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: R2_FORCE_PATH_STYLE,
  });
  return s3Client;
};

const IMAGE_MAX_DIMENSION = Number(process.env.MEDIA_IMAGE_MAX_DIMENSION || 1600);
const BANNER_MAX_WIDTH = Number(process.env.MEDIA_BANNER_MAX_WIDTH || 1920);
const BANNER_MAX_HEIGHT = Number(process.env.MEDIA_BANNER_MAX_HEIGHT || 1200);
const WEBP_QUALITY = Math.min(100, Math.max(1, Number(process.env.MEDIA_WEBP_QUALITY || 82)));

const DATA_URI_RE = /^data:([^;]+);base64,/i;
const HTTP_URL_RE = /^https?:\/\//i;
const MEDIA_PREFIX_RE = /^\/?media\//i;

const imageExtByMime: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

const videoExtByMime: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/ogg': 'ogv',
  'video/x-matroska': 'mkv',
};

const normalizeFolder = (value: string) =>
  value
    .replace(/\\/g, '/')
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment && segment !== '.' && segment !== '..')
    .join('/');

const toPosixRelative = (value: string) => value.replace(/\\/g, '/').replace(/^\/+/, '');

const joinWithinMediaRoot = (relativePath: string) => {
  const absolutePath = path.resolve(MEDIA_ROOT_DIR, relativePath.split('/').join(path.sep));
  const relativeToRoot = path.relative(MEDIA_ROOT_DIR, absolutePath);
  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
    throw new Error('Invalid media path');
  }
  return absolutePath;
};
const buildPublicUrl = (publicId: string) => {
  const normalizedId = toPosixRelative(publicId);
  if (usingR2) {
    if (!R2_PUBLIC_BASE_URL) {
      throw new Error('R2_PUBLIC_BASE_URL is required when MEDIA_STORAGE_DRIVER is r2');
    }
    return `${R2_PUBLIC_BASE_URL}/${normalizedId}`;
  }
  return `${BACKEND_PUBLIC_URL}${MEDIA_URL_PREFIX}/${normalizedId}`;
};

const ensureDirectory = async (directoryPath: string) => {
  await fs.mkdir(directoryPath, { recursive: true });
};

const inferExtension = (mimeType: string, resourceType: CloudinaryResourceType) => {
  const normalizedMime = mimeType.toLowerCase();
  if (resourceType === 'image') {
    return imageExtByMime[normalizedMime] || 'jpg';
  }
  return videoExtByMime[normalizedMime] || 'mp4';
};

const parseDataUri = (value: string) => {
  const match = value.match(DATA_URI_RE);
  if (!match) throw new Error('Invalid data URI');
  const mimeType = match[1].toLowerCase();
  const base64Data = value.replace(DATA_URI_RE, '');
  const buffer = Buffer.from(base64Data, 'base64');
  return { mimeType, buffer };
};

const buildPublicId = (folder: string, extension: string) => {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  return toPosixRelative(path.posix.join(normalizeFolder(folder), year, month, fileName));
};

const getImageBounds = (folder: string) => {
  const normalized = normalizeFolder(folder);
  if (normalized.startsWith('banners')) {
    return {
      width: BANNER_MAX_WIDTH,
      height: BANNER_MAX_HEIGHT,
    };
  }
  return {
    width: IMAGE_MAX_DIMENSION,
    height: IMAGE_MAX_DIMENSION,
  };
};

const persistImageBuffer = async (buffer: Buffer, folder: string): Promise<StoredMediaFileResult> => {
  const { width, height } = getImageBounds(folder);
  const publicId = buildPublicId(folder, 'webp');
  const transformer = sharp(buffer, { failOn: 'none' }).rotate().resize({
    width,
    height,
    fit: 'inside',
    withoutEnlargement: true,
  });

  const output = await transformer.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer({ resolveWithObject: true });
  if (usingR2) {
    const client = getS3Client();
    await client!.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: publicId,
        Body: output.data,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  } else {
    const absolutePath = joinWithinMediaRoot(publicId);
    await ensureDirectory(path.dirname(absolutePath));
    await fs.writeFile(absolutePath, output.data);
  }

  return {
    url: buildPublicUrl(publicId),
    publicId,
    uploaded: true,
    mimeType: 'image/webp',
    size: output.info.size,
    width: output.info.width,
    height: output.info.height,
  };
};

const persistVideoBuffer = async (buffer: Buffer, mimeType: string, folder: string): Promise<StoredMediaFileResult> => {
  const extension = inferExtension(mimeType, 'video');
  const publicId = buildPublicId(folder, extension);
  if (usingR2) {
    const client = getS3Client();
    await client!.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: publicId,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  } else {
    const absolutePath = joinWithinMediaRoot(publicId);
    await ensureDirectory(path.dirname(absolutePath));
    await fs.writeFile(absolutePath, buffer);
  }

  return {
    url: buildPublicUrl(publicId),
    publicId,
    uploaded: true,
    mimeType,
    size: buffer.length,
  };
};

const extractPublicIdFromMediaUrl = (value: string): string | null => {
  const normalized = value.trim();
  if (!normalized) return null;
  const withoutQuery = normalized.split('?')[0].split('#')[0];

  if (withoutQuery.startsWith(`${BACKEND_PUBLIC_URL}${MEDIA_URL_PREFIX}/`)) {
    return toPosixRelative(decodeURIComponent(withoutQuery.replace(`${BACKEND_PUBLIC_URL}${MEDIA_URL_PREFIX}/`, '')));
  }

  if (withoutQuery.startsWith(`${MEDIA_URL_PREFIX}/`)) {
    return toPosixRelative(decodeURIComponent(withoutQuery.replace(`${MEDIA_URL_PREFIX}/`, '')));
  }

  if (MEDIA_PREFIX_RE.test(withoutQuery)) {
    return toPosixRelative(decodeURIComponent(withoutQuery.replace(MEDIA_PREFIX_RE, '')));
  }

  if (R2_PUBLIC_BASE_URL && withoutQuery.startsWith(`${R2_PUBLIC_BASE_URL}/`)) {
    return toPosixRelative(decodeURIComponent(withoutQuery.replace(`${R2_PUBLIC_BASE_URL}/`, '')));
  }

  try {
    const parsedUrl = new URL(withoutQuery);
    const rawPath = toPosixRelative(decodeURIComponent(parsedUrl.pathname));
    if (!rawPath) return null;
    const segments = rawPath.split('/').filter(Boolean);
    if (segments.length === 0) return null;

    if (parsedUrl.hostname.endsWith('.r2.cloudflarestorage.com') && segments[0] === R2_BUCKET) {
      return toPosixRelative(segments.slice(1).join('/'));
    }

    if (parsedUrl.hostname.endsWith('.r2.dev')) {
      return toPosixRelative(rawPath);
    }
  } catch {
    return null;
  }

  return null;
};

const pruneEmptyParentDirectories = async (startFilePath: string) => {
  let current = path.dirname(startFilePath);
  while (current.startsWith(MEDIA_ROOT_DIR) && current !== MEDIA_ROOT_DIR) {
    const entries = await fs.readdir(current);
    if (entries.length > 0) break;
    await fs.rmdir(current);
    current = path.dirname(current);
  }
};

export const cloudinaryReady = () => {
  if (!usingR2) return true;
  return hasR2Config && Boolean(R2_PUBLIC_BASE_URL);
};

export const mediaStorageConfig = () => ({
  mediaRootDir: MEDIA_ROOT_DIR,
  mediaUrlPrefix: MEDIA_URL_PREFIX,
  backendPublicUrl: BACKEND_PUBLIC_URL,
  storageDriver: usingR2 ? 'r2' : 'local',
});

export const isDataUri = (value: string) => DATA_URI_RE.test(value);

const isHttpUrl = (value: string) => HTTP_URL_RE.test(value);

export const uploadProductMedia = async (
  source: string,
  resourceType: CloudinaryResourceType,
  folder: string,
): Promise<UploadedMediaResult> => {
  const normalized = source.trim();
  if (!normalized) return { url: '', publicId: null, uploaded: false };

  if (isDataUri(normalized)) {
    const { mimeType, buffer } = parseDataUri(normalized);
    if (resourceType === 'image') {
      return persistImageBuffer(buffer, folder);
    }
    return persistVideoBuffer(buffer, mimeType, folder);
  }

  if (isHttpUrl(normalized) || normalized.startsWith('/')) {
    return {
      url: normalized,
      publicId: extractPublicIdFromMediaUrl(normalized),
      uploaded: false,
    };
  }

  return { url: normalized, publicId: null, uploaded: false };
};

export const storeUploadedMediaFile = async (
  fileBuffer: Buffer,
  mimeType: string,
  resourceType: CloudinaryResourceType,
  folder: string,
): Promise<StoredMediaFileResult> => {
  if (resourceType === 'image') {
    return persistImageBuffer(fileBuffer, folder);
  }
  return persistVideoBuffer(fileBuffer, mimeType, folder);
};

export const destroyMediaByPublicId = async (
  publicId: string,
  _resourceType: CloudinaryResourceType,
): Promise<void> => {
  const normalized = toPosixRelative(publicId.trim());
  if (!normalized) return;

  if (usingR2) {
    try {
      const client = getS3Client();
      await client!.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: normalized,
        }),
      );
    } catch {
      // Ignore remote delete errors for idempotent behavior.
    }
    return;
  }

  try {
    const absolutePath = joinWithinMediaRoot(normalized);
    await fs.unlink(absolutePath);
    await pruneEmptyParentDirectories(absolutePath);
  } catch {
    // Ignore missing or invalid files for idempotent cleanup behavior.
  }
};
