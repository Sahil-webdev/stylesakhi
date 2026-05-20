import { Router } from 'express';
import BannerConfig from '@/models/BannerConfig';
import { mapBannerDocToPayload } from '@/utils/bannerConfig';
import { sendServerError, sendSuccess } from '@/utils/response';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const config = await BannerConfig.findOne({ key: 'default' });
    return sendSuccess(res, mapBannerDocToPayload(config));
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch banners');
  }
});

export default router;
