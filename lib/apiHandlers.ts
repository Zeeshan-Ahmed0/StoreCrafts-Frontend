import { toastService } from '@/lib/toastService';
import { confirmService } from './confirmService';

/**
 * Common API response handlers with automatic toast notifications
 */
export const apiHandlers = {
  /**
   * Handles successful API response with toast
   */
  success: (message: string = 'Operation successful!') => {
    toastService.success(message);
  },

  /**
   * Handles API errors with toast
   */
  error: (error: any, defaultMessage: string = 'An error occurred') => {
    let message = defaultMessage;

    if (typeof error === 'string') {
      message = error;
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    toastService.error(message);
  },

  /**
   * Handles DELETE requests with confirmation
   */
  deleteWithConfirm: async (
    itemName: string,
    onConfirm: () => Promise<void>
  ): Promise<boolean> => {
    const confirmed = await confirmService.delete(itemName);

    if (confirmed) {
      const loadingId = toastService.loading(`Deleting ${itemName}...`);
      try {
        await onConfirm();
        toastService.update(loadingId, {
          // render: `${itemName} deleted successfully!`,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        return true;
      } catch (error) {
        toastService.update(loadingId, {
          // render: `Failed to delete ${itemName}`,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        return false;
      }
    }

    return false;
  },

  /**
   * Wraps async operation with promise toast
   */
  async: async <T,>(
    operation: Promise<T>,
    messages: {
      pending: string;
      success: string;
      error: string;
    }
  ): Promise<T | null> => {
    try {
      return (await toastService.promise(operation, messages)) as T;
    } catch (error) {
      return null;
    }
  },

  /**
   * Handles form submission with validation
   */
  formSubmit: async (
    onSubmit: () => Promise<void>,
    successMessage: string = 'Form submitted successfully!'
  ): Promise<boolean> => {
    const loadingId = toastService.loading('Submitting form...');

    try {
      await onSubmit();
      toastService.update(loadingId, {
        // render: successMessage,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      return true;
    } catch (error: any) {
      const message = error?.message || 'Failed to submit form';
      toastService.update(loadingId, {
        // render: message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return false;
    }
  },

  /**
   * Handles data fetching
   */
  fetch: async <T,>(
    fetchFn: () => Promise<T>,
    loadingMessage: string = 'Loading...'
  ): Promise<T | null> => {
    const loadingId = toastService.loading(loadingMessage);

    try {
      const result = await fetchFn();
      toastService.dismiss(loadingId);
      return result;
    } catch (error: any) {
      const message = error?.message || 'Failed to load data';
      toastService.update(loadingId, {
        // render: message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return null;
    }
  },

  /**
   * Handles bulk operations with confirmation
   */
  bulkAction: async (
    action: string,
    count: number,
    onConfirm: () => Promise<void>
  ): Promise<boolean> => {
    const confirmed = await confirmService.confirm({
      title: `Confirm ${action}`,
      message: `This will ${action.toLowerCase()} ${count} item(s). Continue?`,
      confirmText: 'Yes, Continue',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      const loadingId = toastService.loading(`${action}ing items...`);
      try {
        await onConfirm();
        toastService.update(loadingId, {
          // render: `${action} completed for ${count} item(s)!`,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        return true;
      } catch (error: any) {
        const message = error?.message || `Failed to ${action.toLowerCase()}`;
        toastService.update(loadingId, {
          // render: message,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        return false;
      }
    }

    return false;
  },
};