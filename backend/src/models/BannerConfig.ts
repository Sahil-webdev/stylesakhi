import mongoose, { Document, Model, Schema } from 'mongoose';

export const BANNER_GENERATIONS = ['gen-z', 'millennial', 'gen-x', 'boomer', 'gen-alpha'] as const;
export type BannerGeneration = (typeof BANNER_GENERATIONS)[number];

export const BANNER_DB_KEY_MAP: Record<
  BannerGeneration,
  'genZ' | 'millennial' | 'genX' | 'boomer' | 'genAlpha'
> = {
  'gen-z': 'genZ',
  millennial: 'millennial',
  'gen-x': 'genX',
  boomer: 'boomer',
  'gen-alpha': 'genAlpha',
};

export interface IBannerItem {
  image: string;
  desktopImage?: string;
  mobileImage?: string;
  alt: string;
  link?: string;
  publicId?: string;
  desktopPublicId?: string;
  mobilePublicId?: string;
}

export interface IBannerConfig extends Document {
  key: string;
  homeBanner: IBannerItem;
  generationBanners: {
    genZ: IBannerItem[];
    millennial: IBannerItem[];
    genX: IBannerItem[];
    boomer: IBannerItem[];
    genAlpha: IBannerItem[];
  };
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_HOME_BANNER: IBannerItem = {
  image: '/hero/heroImg.png',
  desktopImage: '/hero/heroImg.png',
  mobileImage: '/hero/heroImg.png',
  alt: 'StyleSakhi hero banner',
  link: '',
  publicId: '',
  desktopPublicId: '',
  mobilePublicId: '',
};

const defaultCarouselImages = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1265&h=432&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1265&h=432&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1265&h=432&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1265&h=432&fit=crop',
];

const makeDefaultGenerationBanners = (label: string): IBannerItem[] =>
  defaultCarouselImages.map((image, index) => ({
    image,
    desktopImage: image,
    mobileImage: image,
    alt: `${label} Collection Banner ${index + 1}`,
    link: '',
    publicId: '',
    desktopPublicId: '',
    mobilePublicId: '',
  }));

export const DEFAULT_GENERATION_BANNERS: Record<BannerGeneration, IBannerItem[]> = {
  'gen-z': makeDefaultGenerationBanners('Gen Z'),
  millennial: makeDefaultGenerationBanners('Millennials'),
  'gen-x': makeDefaultGenerationBanners('Gen X'),
  boomer: makeDefaultGenerationBanners('Boomers'),
  'gen-alpha': makeDefaultGenerationBanners('Gen Alpha'),
};

const cloneBannerItem = (value: IBannerItem): IBannerItem => ({
  image: value.image,
  desktopImage: value.desktopImage || value.image,
  mobileImage: value.mobileImage || value.desktopImage || value.image,
  alt: value.alt,
  link: value.link || '',
  publicId: value.publicId || '',
  desktopPublicId: value.desktopPublicId || value.publicId || '',
  mobilePublicId: value.mobilePublicId || value.publicId || '',
});

const cloneBannerItems = (value: IBannerItem[]): IBannerItem[] => value.map(cloneBannerItem);

const BannerItemSchema = new Schema<IBannerItem>(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    desktopImage: {
      type: String,
      trim: true,
      default: '',
    },
    mobileImage: {
      type: String,
      trim: true,
      default: '',
    },
    alt: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    publicId: {
      type: String,
      trim: true,
      default: '',
    },
    desktopPublicId: {
      type: String,
      trim: true,
      default: '',
    },
    mobilePublicId: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false },
);

const BannerConfigSchema: Schema<IBannerConfig> = new Schema(
  {
    key: {
      type: String,
      unique: true,
      default: 'default',
      index: true,
    },
    homeBanner: {
      type: BannerItemSchema,
      default: () => cloneBannerItem(DEFAULT_HOME_BANNER),
    },
    generationBanners: {
      genZ: {
        type: [BannerItemSchema],
        default: () => cloneBannerItems(DEFAULT_GENERATION_BANNERS['gen-z']),
      },
      millennial: {
        type: [BannerItemSchema],
        default: () => cloneBannerItems(DEFAULT_GENERATION_BANNERS.millennial),
      },
      genX: {
        type: [BannerItemSchema],
        default: () => cloneBannerItems(DEFAULT_GENERATION_BANNERS['gen-x']),
      },
      boomer: {
        type: [BannerItemSchema],
        default: () => cloneBannerItems(DEFAULT_GENERATION_BANNERS.boomer),
      },
      genAlpha: {
        type: [BannerItemSchema],
        default: () => cloneBannerItems(DEFAULT_GENERATION_BANNERS['gen-alpha']),
      },
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const BannerConfig: Model<IBannerConfig> =
  mongoose.models.BannerConfig || mongoose.model<IBannerConfig>('BannerConfig', BannerConfigSchema);

export default BannerConfig;
