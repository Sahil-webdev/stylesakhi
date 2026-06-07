# StyleSakhi Backend Setup Guide

Complete backend setup documentation for the StyleSakhi e-commerce platform.

## 🎯 Project Overview

**StyleSakhi** is a multi-generational fashion e-commerce platform targeting three distinct customer segments:
- **Gen-Z**: Bold, trendy, streetwear-inspired fashion
- **Millennial**: Sophisticated, modern, career-focused styles
- **Classic**: Timeless, traditional, elegant designs

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 16.1.3 (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **File Storage**: Cloudinary (configured, ready to integrate)
- **Payment Gateway**: Razorpay (configured, ready to integrate)
- **TypeScript**: Full type safety across the application

### Backend Structure
```
client/
├── app/api/                      # API Routes
│   ├── auth/                     # Authentication endpoints
│   │   ├── register/route.ts
│   │   ├── login/route.ts
│   │   └── me/route.ts
│   ├── user/                     # User management
│   │   ├── profile/route.ts
│   │   └── addresses/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── categories/               # Category management
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── products/                 # Product management
│   │   ├── route.ts
│   │   ├── [id]/route.ts
│   │   └── [id]/reviews/route.ts
│   ├── cart/                     # Shopping cart
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── wishlist/                 # Wishlist management
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── orders/                   # Order management
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── admin/                    # Admin endpoints
│       ├── dashboard/route.ts
│       ├── orders/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── users/
│           ├── route.ts
│           └── [id]/route.ts
├── lib/
│   ├── db.ts                     # MongoDB connection with caching
│   ├── models/                   # Mongoose models
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Product.ts
│   │   ├── Cart.ts
│   │   ├── Wishlist.ts
│   │   ├── Address.ts
│   │   ├── Order.ts
│   │   └── Review.ts
│   └── utils/                    # Utility functions
│       ├── auth.ts               # JWT helpers
│       └── response.ts           # API response helpers
├── scripts/
│   └── seed.js                   # Database seeding script
├── .env.local                    # Environment variables
└── API_DOCUMENTATION.md          # Complete API documentation
```

## 📦 Installation

### Prerequisites
- Node.js 20+ installed
- MongoDB installed locally OR MongoDB Atlas account
- VS Code (recommended)

### Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**

Create `.env.local` file in the root directory with:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/stylesakhi
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stylesakhi

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# JWT
JWT_SECRET=your-jwt-secret-here

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (Optional - for payments)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Generate secrets:**
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

3. **Seed Database**
```bash
npm run seed
```

This will create:
- 1 admin user created through the one-time super-admin signup flow
- 3 Categories (Gen-Z, Millennial, Classic)
- 15 Products (5 per category)

4. **Start Development Server**
```bash
npm run dev
```

Server will be available at `http://localhost:3000`

## 🗄️ Database Models

### User Model
```typescript
{
  name: string              // User's full name
  email: string             // Unique email
  password: string          // Bcrypt hashed (select: false)
  phone?: string            // 10-digit phone
  role: 'user' | 'admin'    // User role
  avatar?: string           // Profile picture URL
  isVerified: boolean       // Email verification status
  createdAt: Date
  updatedAt: Date
}
```

**Methods:**
- `comparePassword(password)` - Compare password with hash

**Hooks:**
- `pre('save')` - Auto-hash password if modified

### Category Model
```typescript
{
  name: string              // Category name
  slug: string              // URL-friendly slug (unique)
  description?: string      // Category description
  image?: string            // Category image URL
  order: number             // Sort order
  isActive: boolean         // Visibility status
  createdAt: Date
  updatedAt: Date
}
```

### Product Model
```typescript
{
  name: string              // Product name
  slug: string              // URL-friendly slug (unique)
  description: string       // Full description
  shortDescription: string  // Short summary (max 200 chars)
  category: ObjectId        // Reference to Category
  tags: string[]            // Search tags
  price: number             // Regular price
  discountPrice?: number    // Sale price
  images: string[]          // Image URLs (min 1 required)
  colors: string[]          // Available colors
  sizes: string[]           // Available sizes
  stock: number             // Available quantity
  sku?: string              // Stock Keeping Unit
  brand?: string            // Brand name
  material?: string         // Material description
  careInstructions?: string // Care instructions
  featured: boolean         // Featured product flag
  isActive: boolean         // Visibility status
  averageRating: number     // Average rating (0-5)
  numReviews: number        // Total reviews count
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- Text search on: name, description, tags
- Compound: { category: 1, isActive: 1 }, { featured: 1, isActive: 1 }

### Cart Model
```typescript
{
  user: ObjectId            // Reference to User (unique)
  items: [{
    product: ObjectId       // Reference to Product
    quantity: number        // Item quantity (min: 1)
    size?: string           // Selected size
    color?: string          // Selected color
    price: number           // Price at time of adding
  }]
  totalAmount: number       // Auto-calculated total
  createdAt: Date
  updatedAt: Date
}
```

**Hooks:**
- `pre('save')` - Auto-calculate totalAmount from items

### Wishlist Model
```typescript
{
  user: ObjectId            // Reference to User (unique)
  products: ObjectId[]      // Array of Product references
  createdAt: Date
  updatedAt: Date
}
```

### Address Model
```typescript
{
  user: ObjectId            // Reference to User
  fullName: string          // Recipient name
  phone: string             // Contact number
  addressLine1: string      // Street address
  addressLine2?: string     // Apartment, suite, etc.
  city: string              // City
  state: string             // State
  pincode: string           // 6-digit pincode
  country: string           // Country (default: India)
  isDefault: boolean        // Default address flag
  addressType: 'home' | 'work' | 'other'
  createdAt: Date
  updatedAt: Date
}
```

**Hooks:**
- `pre('save')` - Ensure only one default address per user

### Order Model
```typescript
{
  user: ObjectId            // Reference to User
  orderNumber: string       // Auto-generated (SS + timestamp + count)
  items: [{
    product: ObjectId       // Reference to Product
    name: string            // Product name snapshot
    image: string           // Product image snapshot
    price: number           // Price at time of order
    quantity: number        // Ordered quantity
    size?: string           // Selected size
    color?: string          // Selected color
  }]
  shippingAddress: {        // Shipping details snapshot
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country: string
  }
  paymentMethod: 'razorpay' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentId?: string        // Payment gateway ID
  itemsPrice: number        // Subtotal
  shippingPrice: number     // Shipping cost (₹100 or free)
  taxPrice: number          // Tax amount (18% GST)
  totalPrice: number        // Final total
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  deliveredAt?: Date        // Delivery timestamp
  cancelledAt?: Date        // Cancellation timestamp
  cancellationReason?: string
  trackingNumber?: string   // Shipment tracking ID
  notes?: string            // Admin notes
  createdAt: Date
  updatedAt: Date
}
```

**Pricing Logic:**
- `shippingPrice`: Free if itemsPrice > ₹1000, otherwise ₹100
- `taxPrice`: itemsPrice × 0.18 (18% GST)
- `totalPrice`: itemsPrice + shippingPrice + taxPrice

**Hooks:**
- `pre('save')` - Auto-generate orderNumber (SS{timestamp}{count})

**Indexes:**
- { user: 1, createdAt: -1 }
- { orderNumber: 1 }
- { status: 1 }

### Review Model
```typescript
{
  user: ObjectId            // Reference to User
  product: ObjectId         // Reference to Product
  rating: number            // Rating 1-5
  comment: string           // Review text (10-1000 chars)
  images: string[]          // Review images
  isVerifiedPurchase: boolean // Auto-detected from orders
  likes: number             // Helpful votes (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- Compound unique: { user: 1, product: 1 } (one review per user per product)

**Hooks:**
- `post('save')` - Update Product averageRating and numReviews

## 🔐 Authentication Flow

### Registration
1. User submits name, email, password, phone
2. Validate input (name min 2 chars, email format, password min 6 chars)
3. Check email uniqueness
4. Create user (password auto-hashed by model hook)
5. Generate JWT token (7-day expiry)
6. Return token + user data

### Login
1. User submits email, password
2. Find user by email (include password field)
3. Compare password using bcrypt
4. Generate JWT token
5. Return token + user data

### Protected Routes
1. Extract token from Authorization header (Bearer {token})
2. Verify JWT token
3. Extract user payload (userId, email, role)
4. Fetch user from database
5. Proceed with request

### Admin Routes
1. All steps from Protected Routes
2. Check if user role === 'admin'
3. Return 403 Forbidden if not admin

## 📡 API Endpoints Summary

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### User Profile (Protected)
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile

### Addresses (Protected)
- `GET /api/user/addresses` - Get all addresses
- `POST /api/user/addresses` - Create address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address

### Categories
- `GET /api/categories` - Get all categories (Public)
- `GET /api/categories/:id` - Get single category (Public)
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Products
- `GET /api/products` - List products with filters (Public)
- `GET /api/products/:id` - Get single product (Public)
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Product Reviews
- `GET /api/products/:id/reviews` - Get product reviews (Public)
- `POST /api/products/:id/reviews` - Create review (Protected)

### Cart (Protected)
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Wishlist (Protected)
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `DELETE /api/wishlist` - Clear wishlist

### Orders (Protected)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Cancel order

### Admin Dashboard (Admin)
- `GET /api/admin/dashboard` - Get dashboard stats

### Admin Orders (Admin)
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status

### Admin Users (Admin)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

**Total: 34 API endpoints**

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API documentation with request/response examples.

## 🧪 Testing the Backend

### Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create new request
3. Set method and URL
4. Add headers (if authenticated):
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
5. Add body (if POST/PUT)
6. Send request

### Example: Register and Login

**1. Register:**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**2. Login:**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**3. Get Products:**
```http
GET http://localhost:3000/api/products?page=1&limit=10
```

**4. Get Current User:**
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_TOKEN_FROM_LOGIN
```

## 🎯 Next Steps

### Phase 2: Third-Party Integrations
- [ ] Cloudinary image upload utility
- [ ] Razorpay payment integration
- [ ] Email service (nodemailer/sendgrid)

### Phase 3: Simple Test UI
- [ ] Test pages under /test/ directory
- [ ] Auth test page (register/login forms)
- [ ] Products test page (CRUD operations)
- [ ] Cart test page (add/update/remove)
- [ ] Checkout test page (order placement)

### Phase 4: Admin Panel
- [ ] Admin dashboard with stats
- [ ] Product management interface
- [ ] Order management interface
- [ ] User management interface

### Phase 5: Frontend Polish
- [ ] Replace test UI with designed components
- [ ] Product listing and detail pages
- [ ] Elegant checkout flow
- [ ] User account pages

## 🐛 Common Issues

### MongoDB Connection Error
**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   ```
2. Check MONGODB_URI in .env.local
3. For MongoDB Atlas, ensure IP is whitelisted

### JWT Error
**Error:** `JsonWebTokenError: invalid signature`

**Solution:**
1. Check JWT_SECRET in .env.local matches
2. Clear browser localStorage/cookies
3. Generate new token by logging in again

### Package Installation Error
**Error:** `ENOENT: no such file or directory`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

When adding new features:
1. Create model in `lib/models/` if needed
2. Create API route in `app/api/`
3. Add authentication/authorization checks
4. Use standardized response helpers
5. Update API_DOCUMENTATION.md
6. Test thoroughly

## 📝 Notes

- All passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Cart total is auto-calculated on save
- Default address logic prevents multiple defaults
- One review per user per product enforced
- Order stock validation prevents overselling
- GST is 18% on all orders
- Free shipping on orders > ₹1000

---

**Built with ❤️ for StyleSakhi**
