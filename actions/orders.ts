'use server';

import { serverOnly } from '@/lib/server-only';
import { apiService } from '@/lib/api-service';
import { ENDPOINTS } from '@/lib/api-endpoints';
import { Order, OrderFilterParams, DataFetchState } from '@/types';

serverOnly();
export const listOrdersAction = async (
  params: OrderFilterParams = { page: 1, pageSize: 20 }
): Promise<DataFetchState<Order>> => {
  try {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status }),
      ...(params.paymentStatus && { paymentStatus: params.paymentStatus }),
      ...(params.sort && { sort: params.sort }),
      ...(params.order && { order: params.order }),
    });

    const data = (await apiService.get(`${ENDPOINTS.ORDERS.LIST}?${query}`)) as any;
    
    return {
      data: data.data || data,
      total: data.total || (Array.isArray(data) ? data.length : 0),
      page: params.page,
      pageSize: params.pageSize,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// Server action for fetching single order
export const getOrderAction = async (id: string): Promise<Order> => {
  try {
    return await apiService.get(ENDPOINTS.ORDERS.GET(id));
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
};

// Client-compatible action for updating order
export const updateOrderAction = async (id: string, payload: Partial<Order>) => {
  try {
    const data = await apiService.put(ENDPOINTS.ORDERS.UPDATE(id), JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error updating order:', error);
    return { success: false, error: error.message || 'Failed to update order' } as any;
  }
};

// Client-compatible action for deleting order
export const deleteOrderAction = async (id: string) => {
  try {
    await apiService.delete(ENDPOINTS.ORDERS.DELETE(id));
    return { success: true, data: null } as any;
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return { success: false, error: error.message || 'Failed to delete order' } as any;
  }
};

// Legacy exports for backward compatibility
export const listOrders = listOrdersAction;
export const getOrder = getOrderAction;
export const updateOrder = updateOrderAction;
export const deleteOrder = deleteOrderAction;
