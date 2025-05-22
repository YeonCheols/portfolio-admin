export type ToastType = 'success' | 'error' | 'warning';

export type ToastProps = {
  type: ToastType;
  message?: string;
};
