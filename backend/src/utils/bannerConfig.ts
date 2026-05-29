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

type MapBannerOptions = {
  publicBaseUrl?: string;
};

const normalizeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const normalizePublicBase = (value?: string) => normalizeString(value).replace(/\/+$/, '');

const normalizeMediaUrl = (value: string, publicBaseUrl?: string) => {
  const normalized = normalizeString(value);
  if (!normalized) return '';

  const localMediaMatch = normalized.match(/^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(\/media\/.+)$/i);
  if (localMediaMatch) {
    const mediaPath = localMediaMatch[1];
    const base = normalizePublicBase(publicBaseUrl);
    return base ? `${base}${mediaPath}` : mediaPath;
  }

  return normalized;
};

const normalizePublicItem = (value: unknown, fallback: IBannerItem, publicBaseUrl?: string): BannerPayloadItem => {
  const source = ((value as IBannerItem | undefined) || {}) as Partial<IBannerItem>;
  const fallbackDesktop = normalizeMediaUrl(fallback.desktopImage || fallback.image, publicBaseUrl);
  const fallbackMobile = fallback.mobileImage || fallbackDesktop;

  const desktopImage =
    normalizeMediaUrl(normalizeString(source.desktopImage), publicBaseUrl) ||
    normalizeMediaUrl(normalizeString(source.image), publicBaseUrl) ||
    fallbackDesktop;
  const mobileImage =
    normalizeMediaUrl(normalizeString(source.mobileImage), publicBaseUrl) || desktopImage || fallbackMobile;
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

const normalizePublicItems = (value: unknown, fallback: IBannerItem[], publicBaseUrl?: string): BannerPayloadItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.map((item) => normalizePublicItem(item, item, publicBaseUrl));
  }

  const trimmed = value
    .slice(0, 4)
    .map((item, index) => normalizePublicItem(item, fallback[index] || fallback[0], publicBaseUrl));
  return trimmed.length > 0
    ? trimmed
    : fallback.map((item) => normalizePublicItem(item, item, publicBaseUrl));
};

export const mapBannerDocToPayload = (doc: IBannerConfig | null, options: MapBannerOptions = {}): BannerPayload => {
  const source = ((doc as any)?.toObject?.() || doc || {}) as Partial<IBannerConfig> & {
    generationBanners?: Record<string, unknown>;
  };
  const publicBaseUrl = normalizePublicBase(options.publicBaseUrl);

  const generationBanners = BANNER_GENERATIONS.reduce<Record<BannerGeneration, BannerPayloadItem[]>>(
    (acc, generation) => {
      const dbKey = BANNER_DB_KEY_MAP[generation];
      const sourceItems = source.generationBanners?.[dbKey];
      acc[generation] = normalizePublicItems(sourceItems, DEFAULT_GENERATION_BANNERS[generation], publicBaseUrl);
      return acc;
    },
    {} as Record<BannerGeneration, BannerPayloadItem[]>,
  );

  return {
    homeBanner: normalizePublicItem(source.homeBanner, DEFAULT_HOME_BANNER, publicBaseUrl),
    generationBanners,
  };
};

export const ensureBannerConfig = async () => {
  const existing = await BannerConfig.findOne({ key: 'default' });
  if (existing) return existing;
  return BannerConfig.create({ key: 'default' });
};
