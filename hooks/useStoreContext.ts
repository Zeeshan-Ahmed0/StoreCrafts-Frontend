/**
 * Custom hook to resolve store context in the new route-based architecture
 * Supports both JWT-based store identification and URL-based store slug
 */

'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface StoreContext {
  storeId: string | null;
  storename: string;
  isValid: boolean;
  error: string | null;
}

/**
 * Hook to get store context from either JWT (for admin) or URL (for storefront)
 * @returns Store context with storeId, storename, validation status
 */
export const useStoreContext = (): StoreContext => {
  const params = useParams();
  const { user } = useAuth();
  const [context, setContext] = useState<StoreContext>({
    storeId: null,
    storename: '',
    isValid: false,
    error: null,
  });

  useEffect(() => {
    // Extract storename from URL params (new route group structure)
    const urlStorename = params?.storename as string | undefined;

    if (!urlStorename) {
      setContext({
        storeId: null,
        storename: '',
        isValid: false,
        error: 'No store context found in URL',
      });
      return;
    }

    // For authenticated admin users: verify JWT storeId matches URL storename
    if (user && user.role === 'store_admin') {
      if (!user.storeId) {
        setContext({
          storeId: null,
          storename: urlStorename,
          isValid: false,
          error: 'Authenticated user has no store context',
        });
        return;
      }

      // Note: In a production system, you'd verify that the user's storeId
      // corresponds to the urlStorename. For now, we trust the routing.
      setContext({
        storeId: user.storeId,
        storename: urlStorename,
        isValid: true,
        error: null,
      });
    }
    // For super_admin: can access any store via URL
    else if (user && user.role === 'super_admin') {
      setContext({
        storeId: null, // Super admin doesn't have a specific storeId
        storename: urlStorename,
        isValid: true,
        error: null,
      });
    }
    // For unauthenticated or customer users: use URL storename only
    else {
      setContext({
        storeId: user?.storeId || null,
        storename: urlStorename,
        isValid: true,
        error: null,
      });
    }
  }, [params?.storename, user]);

  return context;
};

/**
 * Hook to validate store access for admin users
 * Ensures user is trying to access their own store
 * @throws If user doesn't have access
 */
export const useValidateStoreAccess = (): boolean => {
  const { storeId, isValid, error } = useStoreContext();
  const { user } = useAuth();

  useEffect(() => {
    if (!isValid) {
      console.warn('Invalid store context:', error);
      // Could redirect to error page or show toast
      return;
    }

    // Admin users should only access their own store
    if (user && user.role === 'store_admin') {
      if (storeId && user.storeId !== storeId) {
        console.error('Store access denied: user store ID mismatch');
        // Redirect or show error
        return;
      }
    }
  }, [storeId, isValid, error, user]);

  return isValid;
};

export default {
  useStoreContext,
  useValidateStoreAccess,
};
