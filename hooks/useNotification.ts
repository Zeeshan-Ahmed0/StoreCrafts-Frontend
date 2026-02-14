import { useCallback } from 'react';
import { toastService } from '../lib/toastService';
import { confirmService } from '../lib/confirmService';

export const useNotification = () => {
  return {
    // Toast notifications
    toast: {
      success: useCallback((message: string) => toastService.success(message), []),
      error: useCallback((message: string) => toastService.error(message), []),
      info: useCallback((message: string) => toastService.info(message), []),
      warning: useCallback((message: string) => toastService.warning(message), []),
      default: useCallback((message: string) => toastService.default(message), []),
      loading: useCallback((message: string) => toastService.loading(message), []),
      promise: useCallback(
        (promise: Promise<any>, messages: { pending: string; success: string; error: string }) =>
          toastService.promise(promise, messages),
        []
      ),
    },

    // Confirmation dialogs
    confirm: {
      simple: useCallback(
        (title: string, message?: string) =>
          confirmService.confirm({ title, message }),
        []
      ),
      withDeny: useCallback(
        (title: string, message?: string, confirmText?: string, denyText?: string) =>
          confirmService.confirmWithDeny({ title, message, confirmText, denyText }),
        []
      ),
      delete: useCallback((itemName?: string) => confirmService.delete(itemName), []),
      success: useCallback((title: string, message?: string) => confirmService.success(title, message), []),
      error: useCallback((title: string, message?: string) => confirmService.error(title, message), []),
      info: useCallback((title: string, message?: string) => confirmService.info(title, message), []),
      warning: useCallback((title: string, message?: string) => confirmService.warning(title, message), []),
      input: useCallback(
        (title: string, inputType?: 'text' | 'email' | 'password' | 'number', placeholder?: string) =>
          confirmService.input(title, inputType, placeholder),
        []
      ),
    },
  };
};