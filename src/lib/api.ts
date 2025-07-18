import { type ToastOptions, type ApiResult, type CustomAxiosRequestConfig } from '@/types/api';
import axiosInstance from './axiosInstance';

const setBaseUrl = (client: boolean = false) => {
  if (client) {
    axiosInstance.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
  }
};

export const getData = async <T = any>(
  url: string,
  params?: Record<string, unknown>,
  client?: boolean,
  options?: ToastOptions,
): Promise<ApiResult<T>> => {
  setBaseUrl(client);
  try {
    const config: CustomAxiosRequestConfig = {
      params,
      metadata: {
        disableToast: options?.disableToast,
        loadingMsg: options?.loadingMsg,
        successMsg: options?.successMsg,
        errorMsg: options?.errorMsg,
      },
    };
    const { data } = await axiosInstance.get<T>(url, config);
    return { status: true, data };
  } catch (error) {
    return { status: false, error, data: undefined };
  }
};

export const postData = async (url: string, data?: Record<string, any>, client?: boolean, options?: ToastOptions) => {
  setBaseUrl(client);
  try {
    const config: CustomAxiosRequestConfig = {
      metadata: {
        disableToast: options?.disableToast,
        loadingMsg: options?.loadingMsg,
        successMsg: options?.successMsg,
        errorMsg: options?.errorMsg,
      },
    };
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
};

export const patchData = async (url: string, data?: Record<string, any>, client?: boolean, options?: ToastOptions) => {
  setBaseUrl(client);
  try {
    const config: CustomAxiosRequestConfig = {
      metadata: {
        disableToast: options?.disableToast,
        loadingMsg: options?.loadingMsg,
        successMsg: options?.successMsg,
        errorMsg: options?.errorMsg,
      },
    };
    const response = await axiosInstance.patch(url, data, config);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
};

export const putData = async (url: string, data?: Record<string, any>, client?: boolean, options?: ToastOptions) => {
  setBaseUrl(client);
  try {
    const config: CustomAxiosRequestConfig = {
      metadata: {
        disableToast: options?.disableToast,
        loadingMsg: options?.loadingMsg,
        successMsg: options?.successMsg,
        errorMsg: options?.errorMsg,
      },
    };
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
};

export const deleteData = async (url: string, data?: Record<string, any>, client?: boolean, options?: ToastOptions) => {
  setBaseUrl(client);
  try {
    const config: CustomAxiosRequestConfig = {
      data,
      metadata: {
        disableToast: options?.disableToast,
        loadingMsg: options?.loadingMsg,
        successMsg: options?.successMsg,
        errorMsg: options?.errorMsg,
      },
    };
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
};
