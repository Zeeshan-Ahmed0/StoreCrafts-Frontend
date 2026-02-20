'use server';

import { serverOnly } from '@/lib/server-only';
import { apiService } from '@/lib/api-service';
import { ENDPOINTS } from '@/lib/api-endpoints';
import { Coupon, CouponFilterParams, DataFetchState } from '@/types';

serverOnly();

// Server action for fetching coupons with pagination
export const listCouponsAction = async (
  params: CouponFilterParams = { page: 1, pageSize: 20 }
): Promise<DataFetchState<Coupon>> => {
  try {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status }),
      ...(params.sort && { sort: params.sort }),
      ...(params.order && { order: params.order }),
    });

    const data = (await apiService.get(`${ENDPOINTS.COUPONS.LIST}?${query}`)) as any;
    
    return {
      data: data.data || data,
      total: data.total || (Array.isArray(data) ? data.length : 0),
      page: params.page,
      pageSize: params.pageSize,
    };
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw new Error('Failed to fetch coupons');
  }
};

// Server action for fetching single coupon
export const getCouponAction = async (id: string): Promise<Coupon> => {
  try {
    return await apiService.get(ENDPOINTS.COUPONS.UPDATE(id));
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw new Error('Failed to fetch coupon');
  }
};

// Client-compatible action for creating coupon
export const createCouponAction = async (payload: Partial<Coupon>) => {
  try {
    const data = await apiService.post(ENDPOINTS.COUPONS.CREATE, JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return { success: false, error: error.message || 'Failed to create coupon' } as any;
  }
};

// Client-compatible action for updating coupon
export const updateCouponAction = async (id: string, payload: Partial<Coupon>) => {
  try {
    const data = await apiService.put(ENDPOINTS.COUPONS.UPDATE(id), JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return { success: false, error: error.message || 'Failed to update coupon' } as any;
  }
};

// Client-compatible action for deleting coupon
export const deleteCouponAction = async (id: string) => {
  try {
    await apiService.delete(ENDPOINTS.COUPONS.DELETE(id));
    return { success: true, data: null } as any;
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return { success: false, error: error.message || 'Failed to delete coupon' } as any;
  }
};

// Legacy exports for backward compatibility
export const listCoupons = listCouponsAction;
export const getCoupon = getCouponAction;
export const createCoupon = createCouponAction;
export const updateCoupon = updateCouponAction;
export const deleteCoupon = deleteCouponAction;
