'use server';

import { apiService } from '@/lib/api-service';
import { ENDPOINTS } from '@/lib/api-endpoints';

export const listBanners = async (storeId?: string) => {
  if (storeId) return apiService.get(ENDPOINTS.BANNERS.PUBLIC(storeId));
  return apiService.get(ENDPOINTS.BANNERS.LIST);
};

export const createBanner = async (payload: any) =>
  apiService.post(ENDPOINTS.BANNERS.CREATE, JSON.stringify(payload));

export const updateBanner = async (id: string | number, payload: any) =>
  apiService.put(ENDPOINTS.BANNERS.UPDATE(String(id)), JSON.stringify(payload));

export const deleteBanner = async (id: string | number) =>
  apiService.delete(ENDPOINTS.BANNERS.DELETE(String(id)));
