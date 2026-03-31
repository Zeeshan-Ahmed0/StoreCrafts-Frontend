'use server';

import { serverOnly } from '@/lib/server-only';
import { apiService } from '@/lib/api-service';
import { ENDPOINTS } from '@/lib/api-endpoints';
import { StoreUser, UserFilterParams, DataFetchState } from '@/types';

serverOnly();

// Server action for fetching users with pagination
export const listUsersAction = async (
  params: UserFilterParams = { page: 1, pageSize: 20 },
  storeSlug?: string
): Promise<DataFetchState<StoreUser>> => {
  try {
    const query = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.role && { role: params.role }),
      ...(params.status && { status: params.status }),
      ...(params.sort && { sort: params.sort }),
      ...(params.order && { order: params.order }),
    });

    const data = (await apiService.get(`${ENDPOINTS.USERS.LIST(storeSlug)}?${query}`)) as any;
    
    return {
      data: data.data || data,
      total: data.total || (Array.isArray(data) ? data.length : 0),
      page: params.page,
      pageSize: params.pageSize,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Server action for fetching single user
export const getUserAction = async (id: string): Promise<StoreUser> => {
  try {
    return await apiService.get(ENDPOINTS.USERS.GET(id));
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};

// Client-compatible action for creating user
export const createUserAction = async (payload: Partial<StoreUser>, storeSlug?: string) => {
  try {
    const endpoint = ENDPOINTS.USERS.CREATE(storeSlug);
    const data = await apiService.post(endpoint, JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message || 'Failed to create user' } as any;
  }
};

// Client-compatible action for updating user
export const updateUserAction = async (id: string, payload: Partial<StoreUser>, storeSlug?: string) => {
  try {
    const endpoint = ENDPOINTS.USERS.UPDATE(id, storeSlug);
    const data = await apiService.put(endpoint, JSON.stringify(payload));
    return { success: true, data } as any;
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message || 'Failed to update user' } as any;
  }
};

// Client-compatible action for deleting user
export const deleteUserAction = async (id: string, storeSlug?: string) => {
  try {
    const endpoint = ENDPOINTS.USERS.DELETE(id, storeSlug);
    await apiService.delete(endpoint);
    return { success: true, data: null } as any;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message || 'Failed to delete user' } as any;
  }
};

// Legacy exports for backward compatibility
export const listUsers = listUsersAction;
export const getUser = getUserAction;
export const createUser = createUserAction;
export const updateUser = updateUserAction;
export const deleteUser = deleteUserAction;
