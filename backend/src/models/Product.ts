import mongoose, { Document, Model, Schema } from 'mongoose';

export const PRODUCT_CATEGORIES = ['clothing', 'accessories', 'sneakers'] as const;
export const PRODUCT_GENERATIONS = ['gen-z', 'millennial', 'gen-x', 'boomer', 'gen-alpha'] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductGeneration = (typeof PRODUCT_GENERATIONS)[number];

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  subCategory?: string;
  generation: ProductGeneration;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  video?: string;
  brand?: string;
  sizes: string[];
  colors: string[];
  productDetails: Record<string, string>;
  averageRating: number;
  numReviews: number;
  isHighestSelling: boolean;
  highestSellingMarkedAt?: Date | null;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: 2,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: 6,
    },
    category: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      required: [true, 'Category is required'],
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    generation: {
      type: String,
      enum: PRODUCT_GENERATIONS,
      required: [true, 'Generation is required'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length > 0 && value.length <= 4,
        message: 'Please provide between 1 and 4 images',
      },
    },
    video: {
      type: String,
      trim: true,
      default: '',
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    productDetails: {
      type: Map,
      of: String,
      default: {},
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isHighestSelling: {
      type: Boolean,
      default: false,
      index: true,
    },
    highestSellingMarkedAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

ProductSchema.index({ name: 'text', description: 'text', brand: 'text', subCategory: 'text' });
ProductSchema.index({ generation: 1, category: 1, isActive: 1, createdAt: -1 });
ProductSchema.index({ generation: 1, isHighestSelling: 1, highestSellingMarkedAt: -1, isActive: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
