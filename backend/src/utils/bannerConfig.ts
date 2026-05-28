import BannerConfig, {
  BANNER_DB_KEY_MAP,
  BANNER_GENERATIONS,
  DEFAULT_GENERATION_BANNERS,
  DEFAULT_HOME_BANNER,
  type BannerGeneration,
  type IBannerConfig,
  type IBannerItem,
} from '@/models/BannerConfig';

export type BannerPayloadItem = {
  image: string;
  desktopImage?: string;
  mobileImage?: string;
  alt: string;
  link?: string;
};

export type BannerPayload = {
  homeBanner: BannerPayloadItem;
  generationBanners: Record<BannerGeneration, BannerPayloadItem[]>;
};

const normalizeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const normalizePublicItem = (value: unknown, fallback: IBannerItem): BannerPayloadItem => {
  const source = ((value as IBannerItem | undefined) || {}) as Partial<IBannerItem>;
  const fallbackDesktop = fallback.desktopImage || fallback.image;
  const fallbackMobile = fallback.mobileImage || fallbackDesktop;

  const desktopImage = normalizeString(source.desktopImage) || normalizeString(source.image) || fallbackDesktop;
  const mobileImage = normalizeString(source.mobileImage) || desktopImage || fallbackMobile;
  const image = desktopImage || mobileImage || fallback.image;
  const alt = normalizeString((value as IBannerItem | undefined)?.alt) || fallback.alt;
  const link = normalizeString((value as IBannerItem | undefined)?.link);
  return {
    image,
    desktopImage,
    mobileImage,
    alt,
    ...(link ? { link } : {}),
  };
};

const normalizePublicItems = (value: unknown, fallback: IBannerItem[]): BannerPayloadItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.map((item) => normalizePublicItem(item, item));
  }

  const trimmed = value.slice(0, 4).map((item, index) => normalizePublicItem(item, fallback[index] || fallback[0]));
  return trimmed.length > 0 ? trimmed : fallback.map((item) => normalizePublicItem(item, item));
};

export const mapBannerDocToPayload = (doc: IBannerConfig | null): BannerPayload => {
  const source = ((doc as any)?.toObject?.() || doc || {}) as Partial<IBannerConfig> & {
    generationBanners?: Record<string, unknown>;
  };

  const generationBanners = BANNER_GENERATIONS.reduce<Record<BannerGeneration, BannerPayloadItem[]>>(
    (acc, generation) => {
      const dbKey = BANNER_DB_KEY_MAP[generation];
      const sourceItems = source.generationBanners?.[dbKey];
      acc[generation] = normalizePublicItems(sourceItems, DEFAULT_GENERATION_BANNERS[generation]);
      return acc;
    },
    {} as Record<BannerGeneration, BannerPayloadItem[]>,
  );

  return {
    homeBanner: normalizePublicItem(source.homeBanner, DEFAULT_HOME_BANNER),
    generationBanners,
  };
};

export const ensureBannerConfig = async () => {
  const existing = await BannerConfig.findOne({ key: 'default' });
  if (existing) return existing;
  return BannerConfig.create({ key: 'default' });
};
