export type BannerGeneration = 'gen-z' | 'millennial' | 'gen-x' | 'boomer' | 'gen-alpha';

export type BannerItem = {
  image: string;
  desktopImage?: string;
  mobileImage?: string;
  alt: string;
  link?: string;
};

export type BannerConfigPayload = {
  homeBanner: BannerItem;
  generationBanners: Record<BannerGeneration, BannerItem[]>;
};

const normalizeApiBaseUrl = (input?: string) => {
  const value = (input || '').trim().replace(/\/+$/, '');
  if (!value) return 'https://stylesakhi.com/api';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith(':')) return `http://localhost${value}`;
  if (value.startsWith('/')) return `https://stylesakhi.com${value}`;
  return `http://${value}`;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export const defaultHomeBanner: BannerItem = {
  image: '/hero/heroImg.png',
  desktopImage: '/hero/heroImg.png',
  mobileImage: '/hero/heroImg.png',
  alt: 'StyleSakhi hero banner',
};

const defaultCarouselImages = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1265&h=432&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1265&h=432&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1265&h=432&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1265&h=432&fit=crop',
];

const makeDefaultGenerationBanners = (label: string): BannerItem[] =>
  defaultCarouselImages.map((image, index) => ({
    image,
    desktopImage: image,
    mobileImage: image,
    alt: `${label} Collection Banner ${index + 1}`,
  }));

export const defaultGenerationBanners: Record<BannerGeneration, BannerItem[]> = {
  'gen-z': makeDefaultGenerationBanners('Gen Z'),
  millennial: makeDefaultGenerationBanners('Millennials'),
  'gen-x': makeDefaultGenerationBanners('Gen X'),
  boomer: makeDefaultGenerationBanners('Boomers'),
  'gen-alpha': makeDefaultGenerationBanners('Gen Alpha'),
};

const normalizeBannerItem = (value: unknown, fallback: BannerItem): BannerItem => {
  const source = (value || {}) as Partial<BannerItem>;
  const fallbackDesktop = fallback.desktopImage || fallback.image;
  const fallbackMobile = fallback.mobileImage || fallbackDesktop;
  const desktopImage =
    typeof source.desktopImage === 'string' && source.desktopImage.trim()
      ? source.desktopImage.trim()
      : typeof source.image === 'string' && source.image.trim()
        ? source.image.trim()
        : fallbackDesktop;
  const mobileImage =
    typeof source.mobileImage === 'string' && source.mobileImage.trim()
      ? source.mobileImage.trim()
      : desktopImage || fallbackMobile;
  const image = desktopImage || mobileImage || fallback.image;
  const alt = typeof source.alt === 'string' && source.alt.trim() ? source.alt.trim() : fallback.alt;
  const link = typeof source.link === 'string' && source.link.trim() ? source.link.trim() : '';

  return {
    image,
    desktopImage,
    mobileImage,
    alt,
    ...(link ? { link } : {}),
  };
};

const normalizeGenerationBanners = (value: unknown, generation: BannerGeneration): BannerItem[] => {
  const fallback = defaultGenerationBanners[generation];
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value.slice(0, 4).map((item, index) => normalizeBannerItem(item, fallback[index] || fallback[0]));
};

const fallbackPayload: BannerConfigPayload = {
  homeBanner: defaultHomeBanner,
  generationBanners: defaultGenerationBanners,
};

export const normalizeBannerConfig = (value: unknown): BannerConfigPayload => {
  const source = (value || {}) as Partial<BannerConfigPayload>;
  const generationSource = (source.generationBanners || {}) as Partial<Record<BannerGeneration, BannerItem[]>>;

  return {
    homeBanner: normalizeBannerItem(source.homeBanner, defaultHomeBanner),
    generationBanners: {
      'gen-z': normalizeGenerationBanners(generationSource['gen-z'], 'gen-z'),
      millennial: normalizeGenerationBanners(generationSource.millennial, 'millennial'),
      'gen-x': normalizeGenerationBanners(generationSource['gen-x'], 'gen-x'),
      boomer: normalizeGenerationBanners(generationSource.boomer, 'boomer'),
      'gen-alpha': normalizeGenerationBanners(generationSource['gen-alpha'], 'gen-alpha'),
    },
  };
};

export async function fetchBannerConfig() {
  const response = await fetch(`${API_BASE_URL}/banners`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch banners');
  }

  const payload = await response.json();
  return normalizeBannerConfig(payload?.data);
}

export const getBannerConfigFallback = () => fallbackPayload;

