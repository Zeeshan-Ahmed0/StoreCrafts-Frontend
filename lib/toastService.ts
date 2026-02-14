import { toast, ToastOptions, Bounce, Zoom, Flip, Slide } from 'react-toastify';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';
export type ToastPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
export type ToastTransition = typeof Bounce | typeof Zoom | typeof Flip | typeof Slide;

export interface ToastConfig extends ToastOptions {
  position?: ToastPosition;
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progress?: number;
  transition?: ToastTransition;
}

const defaultConfig: ToastConfig = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
};

export const toastService = {
  success: (message: string, config?: ToastConfig) => {
    toast.success(message, { ...defaultConfig, ...config });
  },

  error: (message: string, config?: ToastConfig) => {
    toast.error(message, { ...defaultConfig, autoClose: 4000, ...config });
  },

  info: (message: string, config?: ToastConfig) => {
    toast.info(message, { ...defaultConfig, ...config });
  },

  warning: (message: string, config?: ToastConfig) => {
    toast.warning(message, { ...defaultConfig, autoClose: 3500, ...config });
  },

  default: (message: string, config?: ToastConfig) => {
    toast(message, { ...defaultConfig, ...config });
  },

  loading: (message: string, config?: ToastConfig) => {
    return toast.loading(message, { ...defaultConfig, autoClose: false, ...config });
  },

  promise: <T,>(
    promise: Promise<T>,
    { pending, success, error }: {
      pending: string;
      success: string;
      error: string;
    },
    config?: ToastConfig
  ) => {
    return toast.promise(
      promise,
      {
        pending: {
          render: pending,
        },
        success: {
          render: success,
        },
        error: {
          render: error,
        },
      },
      { ...defaultConfig, ...config }
    );
  },

  update: (toastId: string | number, options: ToastOptions) => {
    toast.update(toastId, options);
  },

  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  isActive: (toastId: string | number) => {
    return toast.isActive(toastId);
  },
};