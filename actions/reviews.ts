'use server';

import { serverOnly } from '@/lib/server-only';
import { apiService } from '@/lib/api-service';
import { ENDPOINTS } from '@/lib/api-endpoints';
import { Review, ReviewFilterParams, DataFetchState } from '@/types';

serverOnly();

// Server action for fetching reviews with pagination
export const listReviewsAction = async (
  params: ReviewFilterParams = { page: 1, pageSize: 20 }
): Promise<DataFetchState<Review>> => {
  try {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status }),
      ...(params.rating && { rating: params.rating.toString() }),
      ...(params.sort && { sort: params.sort }),
      ...(params.order && { order: params.order }),
    });

    const data = (await apiService.get(`${ENDPOINTS.REVIEWS.LIST}?${query}`)) as any;
    
    return {
      data: data.data || data,
      total: data.total || (Array.isArray(data) ? data.length : 0),
      page: params.page,
      pageSize: params.pageSize,
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
};

// Server action for fetching single review
export const getReviewAction = async (id: string): Promise<Review> => {
  try {
    return await apiService.get(ENDPOINTS.REVIEWS.GET(id));
  } catch (error) {
    console.error('Error fetching review:', error);
    throw new Error('Failed to fetch review');
  }
};

// Client-compatible action for updating review
export const updateReviewAction = async (id: string, payload: Partial<Review>) => {
  try {
    const data = await apiService.put(ENDPOINTS.REVIEWS.UPDATE(id), JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error updating review:', error);
    return { success: false, error: error.message || 'Failed to update review' } as any;
  }
};

// Client-compatible action for deleting review
export const deleteReviewAction = async (id: string) => {
  try {
    await apiService.delete(ENDPOINTS.REVIEWS.DELETE(id));
    return { success: true, data: null } as any;
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return { success: false, error: error.message || 'Failed to delete review' } as any;
  }
};

// Legacy exports for backward compatibility
export const listReviews = listReviewsAction;
export const getReview = getReviewAction;
export const updateReview = updateReviewAction;
export const deleteReview = deleteReviewAction;
