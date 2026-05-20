import { Router } from 'express';
import Product, { PRODUCT_CATEGORIES, PRODUCT_GENERATIONS } from '@/models/Product';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { authenticate, authenticateAdmin, authorizeModule } from '@/middleware/auth';
import { destroyMediaByPublicId, uploadProductMedia } from '@/utils/cloudinary';
import { sendError, sendNotFound, sendServerError, sendSuccess } from '@/utils/response';

const router = Router();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeDetails = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>((acc, [key, item]) => {
    if (typeof item === 'string' && item.trim()) {
      acc[key] = item.trim();
    }
    return acc;
  }, {});
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
};

const toBooleanOrUndefined = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return undefined;
};

const CLOUDINARY_IMAGE_FOLDER = 'stylesakhi/products/images';
const CLOUDINARY_VIDEO_FOLDER = 'stylesakhi/products/videos';

const resolveImagePublicIds = (
  existingImages: string[],
  existingPublicIds: string[],
  nextMedia: Array<{ url: string; publicId: string | null; uploaded: boolean }>,
): string[] => {
  const existingIdQueueByUrl = new Map<string, string[]>();
  existingImages.forEach((url, index) => {
    const publicId = existingPublicIds[index];
    if (!publicId) return;
    const queue = existingIdQueueByUrl.get(url) || [];
    queue.push(publicId);
    existingIdQueueByUrl.set(url, queue);
  });

  return nextMedia.reduce<string[]>((acc, item) => {
    if (item.publicId) {
      acc.push(item.publicId);
      return acc;
    }
    const queue = existingIdQueueByUrl.get(item.url);
    const matched = queue?.shift();
    if (matched) acc.push(matched);
    return acc;
  }, []);
};

// Public product listing with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      generation,
      subCategory,
      search,
      sort = 'newest',
      featured,
      highestSelling,
      isActive,
      page = '1',
      limit = '50',
      slug,
    } = req.query;

    const query: Record<string, unknown> = {};

    if (typeof category === 'string' && PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])) {
      query.category = category;
    }

    if (
      typeof generation === 'string' &&
      PRODUCT_GENERATIONS.includes(generation as (typeof PRODUCT_GENERATIONS)[number])
    ) {
      query.generation = generation;
    }

    if (typeof subCategory === 'string' && subCategory.trim()) {
      query.subCategory = subCategory.trim();
    }

    if (typeof slug === 'string' && slug.trim()) {
      query.slug = slug.trim();
    }

    if (typeof featured === 'string') {
      query.featured = featured === 'true';
    }

    if (typeof highestSelling === 'string') {
      query.isHighestSelling = highestSelling === 'true';
    }

    if (typeof isActive === 'string') {
      query.isActive = isActive === 'true';
    } else {
      query.isActive = true;
    }

    if (typeof search === 'string' && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 50));
    const skip = (parsedPage - 1) * parsedLimit;

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price_low') sortQuery = { price: 1 };
    if (sort === 'price_high') sortQuery = { price: -1 };
    if (sort === 'name_asc') sortQuery = { name: 1 };
    if (sort === 'name_desc') sortQuery = { name: -1 };
    if (sort === 'oldest') sortQuery = { createdAt: 1 };

    const [items, total] = await Promise.all([
      Product.find(query).sort(sortQuery).skip(skip).limit(parsedLimit).lean(),
      Product.countDocuments(query),
    ]);

    return sendSuccess(res, {
      items,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
      },
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch products');
  }
});

// Public highest-selling products for generation pages
router.get('/highest-selling', async (req, res) => {
  try {
    const { generation, category, limit = '4' } = req.query;
    const query: Record<string, unknown> = {
      isActive: true,
      isHighestSelling: true,
    };

    if (
      typeof generation === 'string' &&
      PRODUCT_GENERATIONS.includes(generation as (typeof PRODUCT_GENERATIONS)[number])
    ) {
      query.generation = generation;
    }

    if (typeof category === 'string' && PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])) {
      query.category = category;
    }

    const parsedLimit = Math.min(20, Math.max(1, Number(limit) || 4));
    const items = await Product.find(query)
      .sort({ highestSellingMarkedAt: -1, updatedAt: -1 })
      .limit(parsedLimit)
      .lean();

    return sendSuccess(res, { items });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch highest-selling products');
  }
});

// Product detail by ID or slug
router.get('/:id/reviews', async (req, res) => {
  try {
    const id = String(req.params.id || '');
    const { page = '1', limit = '20' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (parsedPage - 1) * parsedLimit;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);

    const product = isObjectId ? await Product.findById(id).lean() : await Product.findOne({ slug: id }).lean();
    if (!product) return sendNotFound(res, 'Product not found');

    const [items, total] = await Promise.all([
      Review.find({ product: product._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .populate('user', 'name')
        .lean(),
      Review.countDocuments({ product: product._id }),
    ]);

    return sendSuccess(res, {
      items,
      summary: {
        averageRating: Number(product.averageRating || 0),
        numReviews: Number(product.numReviews || 0),
      },
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
      },
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch reviews');
  }
});

router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const id = String(req.params.id || '');
    const { rating, comment } = req.body;
    const parsedRating = Number(rating);

    if (!req.user?._id) return sendError(res, 'Authentication required', 401);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) return sendError(res, 'Rating must be between 1 and 5');
    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) return sendError(res, 'Comment must be at least 5 characters');

    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const product = isObjectId ? await Product.findById(id) : await Product.findOne({ slug: id });
    if (!product) return sendNotFound(res, 'Product not found');

    const isVerifiedPurchase = Boolean(
      await Order.findOne({
        user: req.user._id,
        status: { $ne: 'cancelled' },
        'items.product': product._id,
      }).lean(),
    );

    let review = await Review.findOne({ user: req.user._id, product: product._id });
    if (review) {
      review.rating = parsedRating;
      review.comment = comment.trim();
      review.isVerifiedPurchase = isVerifiedPurchase;
      await review.save();
    } else {
      review = await Review.create({
        user: req.user._id,
        product: product._id,
        rating: parsedRating,
        comment: comment.trim(),
        isVerifiedPurchase,
      });
    }

    const [updatedProduct] = await Promise.all([Product.findById(product._id).lean()]);

    return sendSuccess(
      res,
      {
        review,
        summary: {
          averageRating: Number(updatedProduct?.averageRating || 0),
          numReviews: Number(updatedProduct?.numReviews || 0),
        },
      },
      'Review submitted successfully',
      201,
    );
  } catch (_error) {
    return sendServerError(res, 'Failed to submit review');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = String(req.params.id || '');
    const isObjectId = /^[a-f\d]{24}$/i.test(id);

    const product = isObjectId
      ? await Product.findById(id).lean()
      : await Product.findOne({ slug: id, isActive: true }).lean();

    if (!product) {
      return sendNotFound(res, 'Product not found');
    }

    return sendSuccess(res, product);
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch product');
  }
});

// Create product (admin with create permission)
router.post('/', authenticateAdmin, authorizeModule('products', 'can_create'), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      generation,
      price,
      discountPrice,
      stock,
      images,
      video,
      brand,
      sizes,
      colors,
      productDetails,
      featured,
      isHighestSelling,
      isActive,
      slug,
    } = req.body;

    if (!name || typeof name !== 'string') {
      return sendError(res, 'Product name is required');
    }

    if (!description || typeof description !== 'string') {
      return sendError(res, 'Product description is required');
    }

    if (!category || !PRODUCT_CATEGORIES.includes(category)) {
      return sendError(res, 'Valid category is required');
    }

    if (!generation || !PRODUCT_GENERATIONS.includes(generation)) {
      return sendError(res, 'Valid generation is required');
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return sendError(res, 'Valid price is required');
    }

    const parsedStock = Number(stock ?? 0);
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return sendError(res, 'Valid stock is required');
    }

    const normalizedImagesInput = toStringArray(images).slice(0, 4);
    if (normalizedImagesInput.length === 0) {
      return sendError(res, 'At least one image is required');
    }

    const uploadedImages = await Promise.all(
      normalizedImagesInput.map((item) => uploadProductMedia(item, 'image', CLOUDINARY_IMAGE_FOLDER)),
    );
    const normalizedImages = uploadedImages.map((item) => item.url);
    const imagePublicIds = uploadedImages
      .map((item) => item.publicId || '')
      .filter(Boolean);

    const normalizedVideoInput = typeof video === 'string' ? video.trim() : '';
    const uploadedVideo = normalizedVideoInput
      ? await uploadProductMedia(normalizedVideoInput, 'video', CLOUDINARY_VIDEO_FOLDER)
      : null;

    const parsedIsHighestSelling = toBooleanOrUndefined(isHighestSelling);

    const baseSlug = slugify(typeof slug === 'string' && slug.trim() ? slug : name);
    let finalSlug = baseSlug;
    let suffix = 1;
    while (await Product.exists({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${suffix++}`;
    }

    const created = await Product.create({
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      category,
      subCategory: typeof subCategory === 'string' ? subCategory.trim() : '',
      generation,
      price: parsedPrice,
      discountPrice: discountPrice !== undefined && discountPrice !== null ? Number(discountPrice) : undefined,
      stock: parsedStock,
      images: normalizedImages,
      imagePublicIds,
      video: uploadedVideo?.url || '',
      videoPublicId: uploadedVideo?.publicId || '',
      brand: typeof brand === 'string' ? brand.trim() : '',
      sizes: toStringArray(sizes),
      colors: toStringArray(colors),
      productDetails: normalizeDetails(productDetails),
      featured: Boolean(featured),
      isHighestSelling: parsedIsHighestSelling ?? false,
      highestSellingMarkedAt: parsedIsHighestSelling ? new Date() : null,
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    return sendSuccess(res, created, 'Product created successfully', 201);
  } catch (error: any) {
    if (error?.name === 'ValidationError') {
      return sendError(res, error.message, 422);
    }
    return sendServerError(res, 'Failed to create product');
  }
});

// Update product
router.put('/:id', authenticateAdmin, authorizeModule('products', 'can_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Product not found');
    }

    const updates = { ...req.body } as Record<string, unknown>;
    const imagePublicIdsToDelete: string[] = [];
    let videoPublicIdToDelete = '';

    if (updates.name && typeof updates.name === 'string') {
      const normalizedName = updates.name.trim();
      updates.name = normalizedName;
      if (!updates.slug) {
        updates.slug = slugify(normalizedName);
      }
    }

    if (updates.slug && typeof updates.slug === 'string') {
      updates.slug = slugify(updates.slug);
    }

    if (updates.images !== undefined) {
      const nextImagesInput = toStringArray(updates.images).slice(0, 4);
      if (nextImagesInput.length === 0) {
        return sendError(res, 'At least one image is required');
      }

      const nextImagesUploaded = await Promise.all(
        nextImagesInput.map((item) => uploadProductMedia(item, 'image', CLOUDINARY_IMAGE_FOLDER)),
      );
      updates.images = nextImagesUploaded.map((item) => item.url);

      const nextImagePublicIds = resolveImagePublicIds(
        existing.images || [],
        existing.imagePublicIds || [],
        nextImagesUploaded,
      );
      updates.imagePublicIds = nextImagePublicIds;

      const nextImagePublicIdSet = new Set(nextImagePublicIds);
      imagePublicIdsToDelete.push(
        ...(existing.imagePublicIds || []).filter((publicId) => !nextImagePublicIdSet.has(publicId)),
      );
    }

    if (updates.video !== undefined) {
      const nextVideoInput = typeof updates.video === 'string' ? updates.video.trim() : '';
      if (!nextVideoInput) {
        updates.video = '';
        updates.videoPublicId = '';
        if (existing.videoPublicId) {
          videoPublicIdToDelete = existing.videoPublicId;
        }
      } else {
        const nextVideo = await uploadProductMedia(nextVideoInput, 'video', CLOUDINARY_VIDEO_FOLDER);
        updates.video = nextVideo.url;
        const nextVideoPublicId =
          nextVideo.publicId || (existing.video === nextVideo.url ? existing.videoPublicId || '' : '');
        updates.videoPublicId = nextVideoPublicId;

        if (existing.videoPublicId && existing.videoPublicId !== nextVideoPublicId) {
          videoPublicIdToDelete = existing.videoPublicId;
        }
      }
    }

    if (updates.sizes) {
      updates.sizes = toStringArray(updates.sizes);
    }

    if (updates.colors) {
      updates.colors = toStringArray(updates.colors);
    }

    if (updates.productDetails) {
      updates.productDetails = normalizeDetails(updates.productDetails);
    }

    const parsedIsHighestSelling = toBooleanOrUndefined(updates.isHighestSelling);
    if (typeof parsedIsHighestSelling === 'boolean') {
      updates.isHighestSelling = parsedIsHighestSelling;
      updates.highestSellingMarkedAt = parsedIsHighestSelling ? new Date() : null;
    }

    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return sendNotFound(res, 'Product not found');
    }

    await Promise.allSettled(
      imagePublicIdsToDelete.map((publicId) => destroyMediaByPublicId(publicId, 'image')),
    );
    if (videoPublicIdToDelete) {
      await destroyMediaByPublicId(videoPublicIdToDelete, 'video');
    }

    return sendSuccess(res, updated, 'Product updated successfully');
  } catch (error: any) {
    if (error?.name === 'ValidationError') {
      return sendError(res, error.message, 422);
    }
    return sendServerError(res, 'Failed to update product');
  }
});

// Toggle highest-selling marker (admin)
router.patch('/:id/highest-selling', authenticateAdmin, authorizeModule('products', 'can_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const parsedIsHighestSelling = toBooleanOrUndefined(req.body?.isHighestSelling);

    if (typeof parsedIsHighestSelling !== 'boolean') {
      return sendError(res, 'isHighestSelling must be true or false');
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        isHighestSelling: parsedIsHighestSelling,
        highestSellingMarkedAt: parsedIsHighestSelling ? new Date() : null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return sendNotFound(res, 'Product not found');
    }

    return sendSuccess(
      res,
      updated,
      parsedIsHighestSelling ? 'Marked as highest selling' : 'Removed from highest selling',
    );
  } catch (_error) {
    return sendServerError(res, 'Failed to update highest-selling status');
  }
});

// Soft delete
router.delete('/:id', authenticateAdmin, authorizeModule('products', 'can_delete'), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!product) {
      return sendNotFound(res, 'Product not found');
    }

    return sendSuccess(res, product, 'Product deleted successfully');
  } catch (_error) {
    return sendServerError(res, 'Failed to delete product');
  }
});

export default router;
