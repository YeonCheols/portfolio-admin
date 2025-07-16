import type { AxiosRequestConfig } from 'axios';

export type ApiSuccess<T> = { status: true; data: T };
type ApiError = { status: false; error: unknown; data: undefined };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

export interface ToastOptions {
  disableToast?: boolean;
  loadingMsg?: string;
  successMsg?: string;
  errorMsg?: string;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    disableToast?: boolean;
    loadingMsg?: string;
    successMsg?: string;
    errorMsg?: string;
    loadingToast?: string;
  };
}
