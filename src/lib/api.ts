import axiosInstance from './axiosInstance';

export async function getData(url: string, params?: Record<string, unknown>) {
  try {
    const { data } = await axiosInstance.get(url, { params });
    return data;
  } catch (error) {
    return { status: false, error };
  }
}

export async function postData(url: string, data: Record<string, any>) {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
}

export async function patchData(url: string, data: Record<string, any>) {
  try {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
}
