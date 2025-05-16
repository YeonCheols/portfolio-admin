import axiosInstance from './axiosInstance';

export async function getData(url: string, params?: Record<string, unknown>) {
  try {
    const { data } = await axiosInstance.get(url, { params });
    return data;
  } catch (error) {
    return { status: false, error };
  }
}
