import { Router } from 'express';
import {
  BANNER_DB_KEY_MAP,
  BANNER_GENERATIONS,
  DEFAULT_GENERATION_BANNERS,
  DEFAULT_HOME_BANNER,
  type BannerGeneration,
  type IBannerItem,
} from '@/models/BannerConfig';
import { authenticateAdmin, authorizeModule } from '@/middleware/auth';
import { destroyMediaByPublicId, uploadProductMedia } from '@/utils/cloudinary';
import { ensureBannerConfig, mapBannerDocToPayload } from '@/utils/bannerConfig';
import { sendError, sendServerError, sendSuccess } from '@/utils/response';

const router = Router();

const CLOUDINARY_BANNER_FOLDER = 'stylesakhi/banners';

type BannerItemInput = {
  image?: unknown;
  desktopImage?: unknown;
  mobileImage?: unknown;
  alt?: unknown;
  link?: unknown;
  publicId?: unknown;
  desktopPublicId?: unknown;
  mobilePublicId?: unknown;
};

const normalizeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const collectPublicIdsFromItems = (items: IBannerItem[]) =>
  items.flatMap((item) => {
    const ids = [
      normalizeString(item.publicId),
      normalizeString(item.desktopPublicId),
      normalizeString(item.mobilePublicId),
    ].filter(Boolean);
    return Array.from(new Set(ids));
  });

const consumeUrlPublicId = (urlMap: Map<string, string[]>, url: string) => {
  const queue = urlMap.get(url);
  if (!queue || queue.length === 0) return '';
  const next = queue.shift() || '';
  if (queue.length === 0) {
    urlMap.delete(url);
  } else {
    urlMap.set(url, queue);
  }
  return next;
};

const buildExistingPublicIdQueue = (homeBanner: IBannerItem, generationBanners: Record<BannerGeneration, IBannerItem[]>) => {
  const queue = new Map<string, string[]>();
  const appendPair = (url: string, publicId: string) => {
    if (!url || !publicId) return;
    const existing = queue.get(url) || [];
    existing.push(publicId);
    queue.set(url, existing);
  };
  const append = (item: IBannerItem) => {
    const legacyUrl = normalizeString(item.image);
    const desktopUrl = normalizeString(item.desktopImage) || legacyUrl;
    const mobileUrl = normalizeString(item.mobileImage) || desktopUrl || legacyUrl;
    const legacyPublicId = normalizeString(item.publicId);
    const desktopPublicId = normalizeString(item.desktopPublicId) || legacyPublicId;
    const mobilePublicId = normalizeString(item.mobilePublicId) || legacyPublicId;

    appendPair(legacyUrl, legacyPublicId);
    appendPair(desktopUrl, desktopPublicId);
    appendPair(mobileUrl, mobilePublicId);
  };

  append(homeBanner);
  BANNER_GENERATIONS.forEach((generation) => {
    generationBanners[generation].forEach(append);
  });

  return queue;
};

const getDocumentItems = (config: any) => {
  const homeBanner = (config?.homeBanner || DEFAULT_HOME_BANNER) as IBannerItem;
  const generationBanners = BANNER_GENERATIONS.reduce<Record<BannerGeneration, IBannerItem[]>>(
    (acc, generation) => {
      const dbKey = BANNER_DB_KEY_MAP[generation];
      const value = config?.generationBanners?.[dbKey];
      acc[generation] = Array.isArray(value) && value.length > 0 ? (value as IBannerItem[]).slice(0, 4) : DEFAULT_GENERATION_BANNERS[generation];
      return acc;
    },
    {} as Record<BannerGeneration, IBannerItem[]>,
  );
  return { homeBanner, generationBanners };
};

const processBannerItem = async (
  input: BannerItemInput,
  fallback: IBannerItem,
  urlPublicIdQueue: Map<string, string[]>,
) => {
  const desktopInput = normalizeString(input?.desktopImage) || normalizeString(input?.image);
  if (!desktopInput) {
    throw new Error('Banner image is required');
  }
  const mobileInput = normalizeString(input?.mobileImage) || desktopInput;

  const uploadedDesktop = await uploadProductMedia(desktopInput, 'image', CLOUDINARY_BANNER_FOLDER);
  const uploadedMobile =
    mobileInput === desktopInput
      ? uploadedDesktop
      : await uploadProductMedia(mobileInput, 'image', CLOUDINARY_BANNER_FOLDER);
  const alt = normalizeString(input?.alt) || fallback.alt;
  const link = normalizeString(input?.link);

  const fallbackLegacyId = normalizeString(input?.publicId);
  const fallbackDesktopId = normalizeString(input?.desktopPublicId) || fallbackLegacyId;
  const fallbackMobileId = normalizeString(input?.mobilePublicId) || fallbackLegacyId;
  const desktopPublicId =
    normalizeString(uploadedDesktop.publicId) ||
    consumeUrlPublicId(urlPublicIdQueue, uploadedDesktop.url) ||
    fallbackDesktopId;
  const mobilePublicId =
    normalizeString(uploadedMobile.publicId) ||
    consumeUrlPublicId(urlPublicIdQueue, uploadedMobile.url) ||
    fallbackMobileId ||
    desktopPublicId;

  return {
    image: uploadedDesktop.url,
    desktopImage: uploadedDesktop.url,
    mobileImage: uploadedMobile.url,
    alt,
    link,
    publicId: desktopPublicId,
    desktopPublicId,
    mobilePublicId,
  };
};

router.use(authenticateAdmin);

router.get('/', authorizeModule('settings', 'can_view'), async (_req, res) => {
  try {
    const config = await ensureBannerConfig();
    return sendSuccess(res, mapBannerDocToPayload(config));
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch admin banners');
  }
});

router.put('/', authorizeModule('settings', 'can_edit'), async (req, res) => {
  try {
    const config = await ensureBannerConfig();
    const current = getDocumentItems(config);
    const urlPublicIdQueue = buildExistingPublicIdQueue(current.homeBanner, current.generationBanners);

    const requestedHome = (req.body?.homeBanner || current.homeBanner) as BannerItemInput;
    const requestedGenerationBanners = (req.body?.generationBanners || {}) as Record<string, BannerItemInput[]>;

    const nextHomeBanner = await processBannerItem(requestedHome, DEFAULT_HOME_BANNER, urlPublicIdQueue);

    const nextGenerationEntries = await Promise.all(
      BANNER_GENERATIONS.map(async (generation) => {
        const inputItems = requestedGenerationBanners[generation];
        const fallbackItems = DEFAULT_GENERATION_BANNERS[generation];
        const sourceItems =
          Array.isArray(inputItems) && inputItems.length > 0
            ? inputItems.slice(0, 4)
            : current.generationBanners[generation].slice(0, 4);

        if (sourceItems.length === 0) {
          return [generation, fallbackItems] as const;
        }

        const processedItems = await Promise.all(
          sourceItems.map((item, index) =>
            processBannerItem(item, fallbackItems[index] || fallbackItems[0], urlPublicIdQueue),
          ),
        );

        return [generation, processedItems] as const;
      }),
    );

    const nextGenerationBanners = nextGenerationEntries.reduce<Record<BannerGeneration, IBannerItem[]>>((acc, [generation, items]) => {
      acc[generation] = items;
      return acc;
    }, {} as Record<BannerGeneration, IBannerItem[]>);

    const previousPublicIds = Array.from(
      new Set([
      ...collectPublicIdsFromItems([current.homeBanner]),
      ...BANNER_GENERATIONS.flatMap((generation) => collectPublicIdsFromItems(current.generationBanners[generation])),
      ]),
    );
    const nextPublicIds = new Set([
      normalizeString(nextHomeBanner.publicId),
      normalizeString(nextHomeBanner.desktopPublicId),
      normalizeString(nextHomeBanner.mobilePublicId),
      ...BANNER_GENERATIONS.flatMap((generation) => collectPublicIdsFromItems(nextGenerationBanners[generation])),
    ].filter(Boolean));

    const idsToDelete = previousPublicIds.filter((id) => !nextPublicIds.has(id));

    config.homeBanner = nextHomeBanner;
    config.generationBanners.genZ = nextGenerationBanners['gen-z'];
    config.generationBanners.millennial = nextGenerationBanners.millennial;
    config.generationBanners.genX = nextGenerationBanners['gen-x'];
    config.generationBanners.boomer = nextGenerationBanners.boomer;
    config.generationBanners.genAlpha = nextGenerationBanners['gen-alpha'];
    if (req.user?._id) {
      config.updatedBy = req.user._id as any;
    }

    await config.save();

    await Promise.allSettled(idsToDelete.map((publicId) => destroyMediaByPublicId(publicId, 'image')));

    return sendSuccess(res, mapBannerDocToPayload(config), 'Banners updated successfully');
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Failed to update banners';
    if (message === 'Banner image is required') {
      return sendError(res, message);
    }
    return sendServerError(res, message);
  }
});

export default router;
