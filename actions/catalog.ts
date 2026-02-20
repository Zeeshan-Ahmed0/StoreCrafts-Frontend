'use server';

import { serverOnly } from '@/lib/server-only';
import { apiService } from '@/lib/api-service';
import { ENDPOINTS } from '@/lib/api-endpoints';
import { Product, Category, ProductFilterParams, CategoryFilterParams, DataFetchState } from '@/types';

serverOnly();

// Server action for fetching products with pagination
export const getProductsAction = async (
  params: ProductFilterParams = { page: 1, pageSize: 20 }
): Promise<DataFetchState<Product>> => {
  try {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.category && { category: params.category }),
      ...(params.status && { status: params.status }),
      ...(params.sort && { sort: params.sort }),
      ...(params.order && { order: params.order }),
    });

    const data = (await apiService.get(`${ENDPOINTS.PRODUCTS.LIST}?${query}`)) as any;
    
    return {
      data: data.data || data,
      total: data.total || (Array.isArray(data) ? data.length : 0),
      page: params.page,
      pageSize: params.pageSize,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

// Server action for fetching categories with pagination
export const getCategoriesAction = async (
  params: CategoryFilterParams = { page: 1, pageSize: 20 }
): Promise<DataFetchState<Category>> => {
  try {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.sort && { sort: params.sort }),
      ...(params.order && { order: params.order }),
    });

    const data = (await apiService.get(`${ENDPOINTS.CATEGORIES.LIST}?${query}`)) as any;
    
    return {
      data: data.data || data,
      total: data.total || (Array.isArray(data) ? data.length : 0),
      page: params.page,
      pageSize: params.pageSize,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Server action for fetching single product
export const getProductAction = async (id: string): Promise<Product> => {
  try {
    return await apiService.get(ENDPOINTS.PRODUCTS.GET(id));
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
};

// Client-compatible action for creating category (can be called from client components)
export const createCategoryAction = async (payload: Partial<Category>) => {
  try {
    const data = await apiService.post(ENDPOINTS.CATEGORIES.CREATE, JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message || 'Failed to create category' } as any;
  }
};

// Client-compatible action for updating category
export const updateCategoryAction = async (id: string | number, payload: Partial<Category>) => {
  try {
    const data = await apiService.put(ENDPOINTS.CATEGORIES.UPDATE(String(id)), JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message || 'Failed to update category' } as any;
  }
};

// Client-compatible action for deleting category
export const deleteCategoryAction = async (id: string | number) => {
  try {
    await apiService.delete(ENDPOINTS.CATEGORIES.DELETE(String(id)));
    return { success: true, data: null } as any;
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message || 'Failed to delete category' } as any;
  }
};

// Client-compatible action for creating product
export const createProductAction = async (payload: Partial<Product>) => {
  try {
    const data = await apiService.post(ENDPOINTS.PRODUCTS.CREATE, JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message || 'Failed to create product' } as any;
  }
};

// Client-compatible action for updating product
export const updateProductAction = async (id: string | number, payload: Partial<Product>) => {
  try {
    const data = await apiService.put(ENDPOINTS.PRODUCTS.UPDATE(String(id)), JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message || 'Failed to update product' } as any;
  }
};

// Client-compatible action for deleting product
export const deleteProductAction = async (id: string | number) => {
  try {
    await apiService.delete(ENDPOINTS.PRODUCTS.DELETE(String(id)));
    return { success: true, data: null } as any;
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message || 'Failed to delete product' } as any;
  }
};

// Legacy exports for backward compatibility - these now point to the new actions
export const getProducts = getProductsAction;
export const getCategories = getCategoriesAction;
export const getProduct = getProductAction;
export const createCategory = createCategoryAction;
export const updateCategory = updateCategoryAction;
export const deleteCategory = deleteCategoryAction;
export const createProduct = createProductAction;
export const updateProduct = updateProductAction;
export const deleteProduct = deleteProductAction;
