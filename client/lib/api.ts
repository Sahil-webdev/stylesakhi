/**
 * API Client for StyleSakhi Backend
 * Base URL: http://localhost:5000/api
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiError {
  success: false;
  error: string;
  errors?: Record<string, string>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
          errors: data.errors,
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  // User endpoints
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      method: 'GET',
    });
  }

  async updateProfile(userData: any): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Categories
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request('/categories', {
      method: 'GET',
    });
  }

  // Products
  async getProducts(filters?: Record<string, any>): Promise<ApiResponse<any>> {
    const queryString = filters
      ? '?' + new URLSearchParams(filters).toString()
      : '';
    return this.request(`/products${queryString}`, {
      method: 'GET',
    });
  }

  async getProduct(id: string): Promise<ApiResponse<any>> {
    return this.request(`/products/${id}`, {
      method: 'GET',
    });
  }

  // Cart
  async getCart(): Promise<ApiResponse<any>> {
    return this.request('/cart', {
      method: 'GET',
    });
  }

  async addToCart(productId: string, quantity: number): Promise<ApiResponse<any>> {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  // Wishlist
  async getWishlist(): Promise<ApiResponse<any>> {
    return this.request('/wishlist', {
      method: 'GET',
    });
  }

  async addToWishlist(productId: string): Promise<ApiResponse<any>> {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  // Orders
  async getOrders(filters?: Record<string, any>): Promise<ApiResponse<{ items: any[]; pagination: any }>> {
    const queryString = filters
      ? '?' + new URLSearchParams(filters).toString()
      : '';
    return this.request(`/orders${queryString}`, {
      method: 'GET',
    });
  }

  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async createRazorpayOrder(orderData: any): Promise<ApiResponse<any>> {
    return this.request('/orders/razorpay/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async verifyRazorpayPayment(payload: {
    appOrderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/orders/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<any>> {
    return this.request(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
