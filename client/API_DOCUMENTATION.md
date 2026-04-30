# StyleSakhi Backend API Documentation

Complete REST API documentation for the StyleSakhi e-commerce platform.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```
**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** `200 OK` (same as register)

### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "avatar_url",
    "phone": "9876543210",
    "isVerified": false
  }
}
```

---

## User Profile Endpoints

### Get Profile
```http
GET /api/user/profile
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK` (full user object)

### Update Profile
```http
PUT /api/user/profile
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "avatar": "https://cloudinary.com/avatar.jpg"
}
```
**Response:** `200 OK`

---

## Address Endpoints

### Get All Addresses
```http
GET /api/user/addresses
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "address_id",
      "fullName": "John Doe",
      "phone": "9876543210",
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India",
      "isDefault": true,
      "addressType": "home"
    }
  ]
}
```

### Create Address
```http
POST /api/user/addresses
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "fullName": "John Doe",
  "phone": "9876543210",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "isDefault": true,
  "addressType": "home"
}
```
**Response:** `201 Created`

### Update Address
```http
PUT /api/user/addresses/:id
```
**Headers:** `Authorization: Bearer <token>`
**Body:** (same as create, all fields optional)
**Response:** `200 OK`

### Delete Address
```http
DELETE /api/user/addresses/:id
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`

---

## Category Endpoints

### Get All Categories
```http
GET /api/categories
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "category_id",
      "name": "Gen-Z",
      "slug": "gen-z",
      "description": "Bold and trendy fashion for Gen-Z",
      "image": "category_image_url",
      "order": 1,
      "isActive": true
    }
  ]
}
```

### Get Single Category
```http
GET /api/categories/:id
```
**Response:** `200 OK`

### Create Category (Admin Only)
```http
POST /api/categories
```
**Headers:** `Authorization: Bearer <admin_token>`
**Body:**
```json
{
  "name": "Gen-Z",
  "description": "Bold and trendy fashion",
  "image": "image_url",
  "order": 1
}
```
**Response:** `201 Created`

### Update Category (Admin Only)
```http
PUT /api/categories/:id
```
**Headers:** `Authorization: Bearer <admin_token>`
**Body:** (all fields optional)
**Response:** `200 OK`

### Delete Category (Admin Only)
```http
DELETE /api/categories/:id
```
**Headers:** `Authorization: Bearer <admin_token>`
**Response:** `200 OK`

---

## Product Endpoints

### Get All Products
```http
GET /api/products?page=1&limit=20&category=gen-z&search=dress&minPrice=500&maxPrice=5000&featured=true&sortBy=price&order=asc
```
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `category` (category slug)
- `search` (text search in name/description/tags)
- `minPrice` (minimum price)
- `maxPrice` (maximum price)
- `featured` (true/false)
- `sortBy` (price, createdAt, averageRating)
- `order` (asc, desc)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### Get Single Product
```http
GET /api/products/:id
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Elegant Dress",
    "slug": "elegant-dress",
    "description": "Beautiful dress for all occasions",
    "price": 2999,
    "discountPrice": 2499,
    "images": ["image1.jpg", "image2.jpg"],
    "category": {
      "id": "category_id",
      "name": "Gen-Z",
      "slug": "gen-z"
    },
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Red", "Blue", "Black"],
    "stock": 50,
    "averageRating": 4.5,
    "numReviews": 23,
    "featured": true
  }
}
```

### Create Product (Admin Only)
```http
POST /api/products
```
**Headers:** `Authorization: Bearer <admin_token>`
**Body:**
```json
{
  "name": "Elegant Dress",
  "description": "Beautiful dress for all occasions",
  "shortDescription": "Perfect for parties and events",
  "category": "category_id",
  "price": 2999,
  "discountPrice": 2499,
  "images": ["image1.jpg", "image2.jpg"],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Red", "Blue", "Black"],
  "stock": 50,
  "brand": "StyleSakhi",
  "material": "Cotton",
  "tags": ["dress", "party", "elegant"],
  "featured": true
}
```
**Response:** `201 Created`

### Update Product (Admin Only)
```http
PUT /api/products/:id
```
**Headers:** `Authorization: Bearer <admin_token>`
**Body:** (all fields optional)
**Response:** `200 OK`

### Delete Product (Admin Only)
```http
DELETE /api/products/:id
```
**Headers:** `Authorization: Bearer <admin_token>`
**Response:** `200 OK`

---

## Product Reviews Endpoints

### Get Product Reviews
```http
GET /api/products/:id/reviews?page=1&limit=10
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review_id",
        "user": {
          "id": "user_id",
          "name": "John Doe",
          "avatar": "avatar_url"
        },
        "rating": 5,
        "comment": "Excellent product!",
        "images": ["review_image.jpg"],
        "isVerifiedPurchase": true,
        "likes": 5,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 23,
      "pages": 3
    }
  }
}
```

### Create Review
```http
POST /api/products/:id/reviews
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent product! Loved it.",
  "images": ["review_image.jpg"]
}
```
**Response:** `201 Created`

---

## Cart Endpoints

### Get Cart
```http
GET /api/cart
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "id": "item_id",
        "product": {
          "id": "product_id",
          "name": "Elegant Dress",
          "images": ["image.jpg"],
          "price": 2999,
          "stock": 50
        },
        "quantity": 2,
        "size": "M",
        "color": "Red",
        "price": 2499
      }
    ],
    "totalAmount": 4998
  }
}
```

### Add to Cart
```http
POST /api/cart
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "productId": "product_id",
  "quantity": 2,
  "size": "M",
  "color": "Red"
}
```
**Response:** `200 OK`

### Update Cart Item
```http
PUT /api/cart/:itemId
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "quantity": 3
}
```
**Response:** `200 OK`

### Remove Cart Item
```http
DELETE /api/cart/:itemId
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`

### Clear Cart
```http
DELETE /api/cart
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`

---

## Wishlist Endpoints

### Get Wishlist
```http
GET /api/wishlist
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`

### Add to Wishlist
```http
POST /api/wishlist
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "productId": "product_id"
}
```
**Response:** `200 OK`

### Remove from Wishlist
```http
DELETE /api/wishlist/:productId
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`

### Clear Wishlist
```http
DELETE /api/wishlist
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`

---

## Order Endpoints

### Get User Orders
```http
GET /api/orders?page=1&limit=10&status=pending
```
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (pending, confirmed, processing, shipped, delivered, cancelled)

**Response:** `200 OK`

### Get Single Order
```http
GET /api/orders/:id
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `200 OK`

### Create Order
```http
POST /api/orders
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay",
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "size": "M",
      "color": "Red"
    }
  ]
}
```
**Response:** `201 Created`

**Pricing Logic:**
- `itemsPrice` = Sum of (product price × quantity)
- `shippingPrice` = ₹100 (Free if itemsPrice > ₹1000)
- `taxPrice` = itemsPrice × 0.18 (18% GST)
- `totalPrice` = itemsPrice + shippingPrice + taxPrice

### Cancel Order
```http
PUT /api/orders/:id
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "action": "cancel",
  "cancellationReason": "Changed my mind"
}
```
**Response:** `200 OK`

---

## Admin Endpoints

### Get Dashboard Stats
```http
GET /api/admin/dashboard
```
**Headers:** `Authorization: Bearer <admin_token>`
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalUsers": 500,
    "totalProducts": 100,
    "totalRevenue": 150000,
    "recentOrders": [...],
    "statusCounts": {
      "pending": 10,
      "processing": 15,
      "shipped": 20,
      "delivered": 100,
      "cancelled": 5
    },
    "monthlyRevenue": [...]
  }
}
```

### Get All Orders (Admin)
```http
GET /api/admin/orders?page=1&limit=20&status=pending
```
**Headers:** `Authorization: Bearer <admin_token>`
**Response:** `200 OK`

### Update Order Status (Admin)
```http
PUT /api/admin/orders/:id
```
**Headers:** `Authorization: Bearer <admin_token>`
**Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456",
  "notes": "Order shipped via Blue Dart"
}
```
**Response:** `200 OK`

### Get All Users (Admin)
```http
GET /api/admin/users?page=1&limit=20&role=user
```
**Headers:** `Authorization: Bearer <admin_token>`
**Response:** `200 OK`

### Update User (Admin)
```http
PUT /api/admin/users/:id
```
**Headers:** `Authorization: Bearer <admin_token>`
**Body:**
```json
{
  "role": "admin",
  "isVerified": true
}
```
**Response:** `200 OK`

### Delete User (Admin)
```http
DELETE /api/admin/users/:id
```
**Headers:** `Authorization: Bearer <admin_token>`
**Response:** `200 OK`

---

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field1": "Field-specific error",
    "field2": "Another error"
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Database Models

### User
- name, email, password, phone
- role (user/admin)
- avatar, isVerified
- timestamps

### Category
- name, slug, description, image
- order, isActive
- timestamps

### Product
- name, slug, description, shortDescription
- category, tags[]
- price, discountPrice
- images[], colors[], sizes[]
- stock, sku, brand, material
- featured, isActive
- averageRating, numReviews
- timestamps

### Cart
- user (unique)
- items[] (product, quantity, size, color, price)
- totalAmount (auto-calculated)
- timestamps

### Wishlist
- user (unique)
- products[]
- timestamps

### Address
- user, fullName, phone
- addressLine1, addressLine2, city, state, pincode, country
- isDefault, addressType
- timestamps

### Order
- user, orderNumber (auto-generated)
- items[] (product, name, image, price, quantity, size, color)
- shippingAddress
- paymentMethod, paymentStatus, paymentId
- itemsPrice, shippingPrice, taxPrice, totalPrice
- status, deliveredAt, cancelledAt, cancellationReason
- trackingNumber, notes
- timestamps

### Review
- user, product (unique together)
- rating (1-5), comment
- images[], isVerifiedPurchase, likes
- timestamps

---

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/stylesakhi

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# JWT
JWT_SECRET=your-jwt-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Testing the API

You can test the API using:
- **Thunder Client** (VS Code extension)
- **Postman**
- **cURL**
- **Fetch/Axios** in JavaScript

Example using cURL:
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Products
curl http://localhost:3000/api/products?page=1&limit=10
```
