import axiosInstance from './axiosInstance';

function setBaseUrl(client?: boolean) {
  if (client) {
    axiosInstance.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
  }
}
export async function getData(url: string, params?: Record<string, unknown>, client?: boolean) {
  setBaseUrl(client);
  try {
    const { data } = await axiosInstance.get(url, { params });
    return data;
  } catch (error) {
    return { status: false, error };
  }
}

export async function postData(url: string, data?: Record<string, any>, client?: boolean) {
  setBaseUrl(client);

  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
}

export async function patchData(url: string, data?: Record<string, any>, client?: boolean) {
  setBaseUrl(client);
  try {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
}

export async function putData(url: string, data?: Record<string, any>, client?: boolean) {
  setBaseUrl(client);
  try {
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
}

export async function deleteData(url: string, data?: Record<string, any>, client?: boolean) {
  setBaseUrl(client);
  try {
    const response = await axiosInstance.delete(url, data);
    return response.data;
  } catch (error) {
    return { status: false, error };
  }
}
