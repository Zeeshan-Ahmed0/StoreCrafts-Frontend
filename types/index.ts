export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  categoryId: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviews?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  expiryDate?: string;
  minOrderValue?: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  itemCount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive?: string;
}

export interface StoreAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
totalReviews: number;
  revenueGrowth: number;
  orderGrowth: number;
  recentOrders: Order[];
  topProducts: Product[];
}

export interface StoreContent {
  id: string;
  banners: Banner[];
  footerLinks: FooterLink[];
  theme: string;
  layout: string;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  active: boolean;
  position: number;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  category: 'company' | 'support' | 'legal';
  position: number;
}

// API responses
export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SingleResponse<T> {
  data: T;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Server Action Results
export interface ServerActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Data Fetching State Types
export interface DataFetchState<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Filter params for different resources
export interface ProductFilterParams extends PaginationParams {
  category?: string;
  status?: Product['status'];
}

export interface CategoryFilterParams extends PaginationParams {
  status?: string;
}

export interface OrderFilterParams extends PaginationParams {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
}

export interface CouponFilterParams extends PaginationParams {
  status?: Coupon['status'];
}

export interface ReviewFilterParams extends PaginationParams {
  status?: Review['status'];
  rating?: number;
}

export interface UserFilterParams extends PaginationParams {
  role?: StoreUser['role'];
  status?: StoreUser['status'];
}