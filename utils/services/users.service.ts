import axiosInstance from './axiosInstance'

const BASE_URL_PATH = process.env.NEXT_PUBLIC_BASE_URL;
const serverUrl = BASE_URL_PATH + "/users";

export const login = (formData:any) => {
  return axiosInstance.post(serverUrl + "/loginAdmin", formData);
};

export const addUser = (formData:any) => {
  return axiosInstance.post(serverUrl + "/register", formData);
};

export const getUser = (query:any) => {
  return axiosInstance.get(`${serverUrl}/getUsers?${query}`);
};
export const getUserDetailsWithCampaigns = (id:any) => {
  return axiosInstance.get(`${serverUrl}/getUserDetailsWithCampaignsData/${id}`);
};

export const updateUserStatus = (id:any, formData:any) => {
  return axiosInstance.patch(`${serverUrl}/updateUserStatus/${id}`, formData);
};

export const deleteUser = (id:any) => {
  return axiosInstance.delete(`${serverUrl}/deleteById/${id}`);
};

export const getById = (id:any) => {
  return axiosInstance.get(`${serverUrl}/getById/${id}`);
};

export const updateUser = (formData:any, id:any) => {
  return axiosInstance.patch(`${serverUrl}/updateById/${id}`, formData);
};