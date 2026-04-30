import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    images: [String],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

const recalculateProductRating = async (productId: mongoose.Types.ObjectId) => {
  const [summary] = await mongoose.models.Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  await mongoose.models.Product.updateOne(
    { _id: productId },
    {
      $set: {
        averageRating: summary ? Number(summary.avgRating || 0) : 0,
        numReviews: summary ? Number(summary.count || 0) : 0,
      },
    },
  );
};

// Update product rating after review save/delete
ReviewSchema.post('save', async function () {
  await recalculateProductRating(this.product as mongoose.Types.ObjectId);
});

ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc?.product) {
    await recalculateProductRating(doc.product as mongoose.Types.ObjectId);
  }
});

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
