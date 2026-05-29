import { Router, type Request } from 'express';
import BannerConfig from '@/models/BannerConfig';
import { mapBannerDocToPayload } from '@/utils/bannerConfig';
import { sendServerError, sendSuccess } from '@/utils/response';

const router = Router();

const getRequestPublicBaseUrl = (req: Request) => {
  const explicit = (process.env.BACKEND_PUBLIC_URL || '').trim().replace(/\/+$/, '');
  if (explicit && !/^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?$/i.test(explicit)) {
    return explicit;
  }

  const forwardedHost = (req.headers['x-forwarded-host'] as string | undefined)?.split(',')[0]?.trim();
  const host = forwardedHost || req.get('host') || '';
  const forwardedProto = (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0]?.trim();
  const proto = forwardedProto || req.protocol || 'https';

  if (host) return `${proto}://${host}`.replace(/\/+$/, '');
  return explicit;
};

router.get('/', async (req, res) => {
  try {
    const config = await BannerConfig.findOne({ key: 'default' });
    return sendSuccess(res, mapBannerDocToPayload(config, { publicBaseUrl: getRequestPublicBaseUrl(req) }));
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch banners');
  }
});

export default router;
