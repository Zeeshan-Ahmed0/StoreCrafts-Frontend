import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

export type ConfirmAction = 'confirm' | 'cancel' | 'deny';

export interface ConfirmConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  denyText?: string;
  isDangerous?: boolean;
  showDeny?: boolean;
}

const defaultConfig: SweetAlertOptions = {
  allowOutsideClick: false,
  allowEscapeKey: true,
  confirmButtonColor: '#3b82f6',
  cancelButtonColor: '#6b7280',
  denyButtonColor: '#ef4444',
};

export const confirmService = {
  /**
   * Simple confirmation dialog with yes/no buttons
   */
  confirm: async (config: ConfirmConfig): Promise<boolean> => {
    const result = await Swal.fire({
      icon: 'question',
      ...defaultConfig,
      title: config.title || 'Are you sure?',
      html: config.message,
      showCancelButton: true,
      confirmButtonText: config.confirmText || 'Yes',
      cancelButtonText: config.cancelText || 'Cancel',
      ...config,
    });

    return result.isConfirmed;
  },

  /**
   * Confirmation with three options: confirm, deny, cancel
   */
  confirmWithDeny: async (config: ConfirmConfig): Promise<ConfirmAction> => {
    const result = await Swal.fire({
      icon: 'question',
      ...defaultConfig,
      title: config.title || 'Are you sure?',
      html: config.message,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: config.confirmText || 'Yes',
      denyButtonText: config.denyText || 'No',
      cancelButtonText: config.cancelText || 'Cancel',
      ...config,
    });

    if (result.isConfirmed) return 'confirm';
    if (result.isDenied) return 'deny';
    return 'cancel';
  },

  /**
   * Delete confirmation with warning icon
   */
  delete: async (itemName?: string): Promise<boolean> => {
    const result = await Swal.fire({
      icon: 'warning',
      ...defaultConfig,
      title: 'Delete Confirmation',
      html: itemName
        ? `Are you sure you want to delete <strong>${itemName}</strong>? This action cannot be undone.`
        : 'Are you sure? This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel',
    });

    return result.isConfirmed;
  },

  /**
   * Success dialog
   */
  success: async (title: string, message?: string): Promise<void> => {
    await Swal.fire({
      icon: 'success',
      ...defaultConfig,
      title,
      html: message,
      confirmButtonText: 'OK',
    });
  },

  /**
   * Error dialog
   */
  error: async (title: string, message?: string): Promise<void> => {
    await Swal.fire({
      icon: 'error',
      ...defaultConfig,
      title,
      html: message,
      confirmButtonText: 'OK',
    });
  },

  /**
   * Info dialog
   */
  info: async (title: string, message?: string): Promise<void> => {
    await Swal.fire({
      icon: 'info',
      ...defaultConfig,
      title,
      html: message,
      confirmButtonText: 'OK',
    });
  },

  /**
   * Warning dialog
   */
  warning: async (title: string, message?: string): Promise<void> => {
    await Swal.fire({
      icon: 'warning',
      ...defaultConfig,
      title,
      html: message,
      confirmButtonText: 'OK',
    });
  },

  /**
   * Input dialog
   */
  input: async (
    title: string,
    inputType: 'text' | 'email' | 'password' | 'number' = 'text',
    placeholder?: string
  ): Promise<string | null> => {
    const result = await Swal.fire({
      icon: 'question',
      ...defaultConfig,
      title,
      input: inputType,
      inputPlaceholder: placeholder,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a value';
        }
      },
    });

    return result.isConfirmed ? result.value : null;
  },

  // /**
  //  * Custom confirmation with full control
  //  */
  // custom: async (config: SweetAlertOptions): Promise<SweetAlertResult> => {
  //   return Swal.fire({
  //     ...defaultConfig,
  //     ...config,
  //   } as SweetAlertOptions);
  // },

  /**
   * Close any open modal
   */
  close: () => {
    Swal.close();
  },

  /**
   * Hide the modal without destroying it
   */
  hide: () => {
    Swal.hideLoading();
  },

  /**
   * Show loading state
   */
  loading: async (title: string): Promise<void> => {
    await Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: (modal) => {
        Swal.showLoading();
      },
    });
  },
};