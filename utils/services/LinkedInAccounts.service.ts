import axiosInstance from './axiosInstance'
const BASE_URL_PATH = process.env.NEXT_PUBLIC_BASE_URL;
const serverUrl = BASE_URL_PATH + "/linkedInAccount";



export const createlinkedInAccount = (formData:any) => {
    return axiosInstance.post(serverUrl + "/", formData);
};

export const getlinkedInAccount = () => {
    return axiosInstance.get(serverUrl + "/");
};

export const deletelinkedInAccount = (id:any) => {
    return axiosInstance.delete(serverUrl + `/deleteById/${id}`);
};
