# StyleSakhi Backend API

Express.js REST API for StyleSakhi - Multi-generational fashion e-commerce platform.

## Tech Stack

- **Node.js** 20+
- **Express.js** 4.21.2 - Web framework
- **TypeScript** 5+ - Type safety
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Security**: helmet, cors, express-rate-limit, compression

## Prerequisites

- Node.js 20 or higher
- MongoDB (local or Atlas)
- npm or yarn

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/stylesakhi
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

Ensure MongoDB is running locally or use MongoDB Atlas connection string.

### 4. Seed the database (optional)

```bash
npm run seed
```

### 5. Start development server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server with hot reload (tsx)
- `npm run build` - Build for production (TypeScript compilation)
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)

### User (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `GET /addresses` - Get addresses
- `POST /addresses` - Add address
- `PUT /addresses/:id` - Update address
- `DELETE /addresses/:id` - Delete address

### Categories (`/api/categories`)
- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `POST /` - Create category (admin)
- `PUT /:id` - Update category (admin)
- `DELETE /:id` - Delete category (admin)

### Products (`/api/products`)
- `GET /` - Get all products with filters
- `GET /:id` - Get product by ID
- `POST /` - Create product (admin)
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)
- `GET /:id/reviews` - Get product reviews
- `POST /:id/reviews` - Add review (protected)

### Cart (`/api/cart`)
- `GET /` - Get user cart
- `POST /` - Add to cart
- `PUT /:id` - Update cart item
- `DELETE /:id` - Remove from cart
- `DELETE /` - Clear cart

### Wishlist (`/api/wishlist`)
- `GET /` - Get user wishlist
- `POST /` - Add to wishlist
- `DELETE /:productId` - Remove from wishlist
- `DELETE /` - Clear wishlist

### Orders (`/api/orders`)
- `GET /` - Get user orders
- `GET /:id` - Get order by ID
- `POST /` - Create order
- `PUT /:id` - Cancel order

### Admin (`/api/admin`)
- `GET /dashboard` - Dashboard stats (admin)
- `GET /orders` - All orders (admin)
- `PUT /orders/:id` - Update order status (admin)
- `GET /users` - All users (admin)
- `PUT /users/:id` - Update user (admin)
- `DELETE /users/:id` - Delete user (admin)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts        # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts            # Authentication middleware
│   ├── models/                # Mongoose models
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Product.ts
│   │   ├── Cart.ts
│   │   ├── Wishlist.ts
│   │   ├── Address.ts
│   │   ├── Order.ts
│   │   └── Review.ts
│   ├── routes/                # Express routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── category.routes.ts
│   │   ├── product.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── wishlist.routes.ts
│   │   ├── order.routes.ts
│   │   └── admin.routes.ts
│   ├── utils/
│   │   ├── jwt.ts             # JWT utilities
│   │   └── response.ts        # Response helpers
│   └── server.ts              # Express app setup
├── .env.example               # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## TypeScript Path Aliases

```typescript
@/*           → src/*
@models/*     → src/models/*
@utils/*      → src/utils/*
@config/*     → src/config/*
@routes/*     → src/routes/*
@middleware/* → src/middleware/*
```

## Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Compression** - Gzip compression
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing with salt rounds

## Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

Admin routes require admin role:

```typescript
role: 'admin'
```

## Error Handling

API returns standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field": "Field-specific error"
  }
}
```

## Development

Built with TypeScript and hot reload using `tsx`. Path aliases configured for clean imports.

## Production

Build and run:

```bash
npm run build
npm start
```

## License

Proprietary - StyleSakhi 2024
