import axios from 'axios';
import toast from 'react-hot-toast';
import { type CustomAxiosRequestConfig } from '@/types/api';
import { getAccessToken } from './auth';

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  baseURL: process.env.API_URL,
  timeout: 10000,
  withCredentials: true,
});

// HTTP 메소드별 기본 메시지
const methodMessages: Record<string, { loading: string; success: string; error: string }> = {
  post: { loading: '추가 중...', success: '추가 되었습니다.', error: '추가 실패' },
  get: { loading: '조회 중...', success: '조회 되었습니다.', error: '조회 실패' },
  put: { loading: '수정 중...', success: '수정 되었습니다.', error: '수정 실패' },
  patch: { loading: '수정 중...', success: '수정 되었습니다.', error: '수정 실패' },
  delete: { loading: '삭제 중...', success: '삭제 되었습니다.', error: '삭제 실패' },
};

axiosInstance.interceptors.request.use(
  async config => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      if (!config.headers) config.headers = {} as any;
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    const meta = (config as CustomAxiosRequestConfig).metadata;
    const method = config.method?.toLowerCase() || '';
    const msg = methodMessages[method];
    if (typeof window !== 'undefined' && !meta?.disableToast && msg) {
      const loadingMsg = meta?.loadingMsg || msg.loading;
      (config as any).metadata = { ...meta, loadingToast: toast.loading(loadingMsg) };
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => {
    const meta = (response.config as CustomAxiosRequestConfig).metadata;
    const method = response.config.method?.toLowerCase() || '';
    const msg = methodMessages[method];
    if (typeof window !== 'undefined' && meta?.loadingToast && msg) {
      toast.dismiss(meta.loadingToast);
      const successMsg = meta?.successMsg || msg.success;
      toast.success(successMsg);
    }
    return response;
  },
  error => {
    const meta = (error.config as any)?.metadata as
      | {
          loadingMsg?: string;
          successMsg?: string;
          errorMsg?: string;
          disableToast?: boolean;
          loadingToast?: string;
        }
      | undefined;
    const method = error.config?.method?.toLowerCase() || '';
    const msg = methodMessages[method];
    if (typeof window !== 'undefined') {
      if (meta?.loadingToast && msg) {
        toast.dismiss(meta.loadingToast);
        // 에러 메시지 우선, 없으면 커스텀 메시지, 없으면 기본 메시지
        const errorMessage = error?.response?.data?.message || meta?.errorMsg || msg.error;
        toast.error(errorMessage);
      } else if (msg) {
        const errorMessage = error?.response?.data?.message || meta?.errorMsg || msg.error;
        toast.error(errorMessage);
      } else {
        toast.error(error?.message || '오류가 발생했습니다.');
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
