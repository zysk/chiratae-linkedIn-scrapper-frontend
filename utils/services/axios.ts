import axios from "axios";
import { toast } from "sonner";

interface RequestOptions {
  url: string;
  payload?: any;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  params?: any;
}

const axiosServices = {
  request: async (method: any, options: RequestOptions) => {
    const { url, payload, setLoading, params } = options;
    if (setLoading) setLoading(true);
    try {
      const response = await method(url, payload, { params });
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      if (setLoading) setLoading(false);
    }
  },

  get: async (options: RequestOptions) => {
    return axiosServices.request(axios.get, options);
  },
  post: async (options: RequestOptions) => {
    return axiosServices.request(axios.post, options);
  },
  patch: async (options: RequestOptions) => {
    return axiosServices.request(axios.patch, options);
  },
  delete: async (options: RequestOptions) => {
    return axiosServices.request(axios.delete, options);
  },
};

export default axiosServices;
