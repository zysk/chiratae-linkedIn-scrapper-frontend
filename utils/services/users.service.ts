import axios from "axios";


const BASE_URL_PATH = process.env.NEXT_PUBLIC_BASE_URL;
const serverUrl = BASE_URL_PATH + "/users";

const axiosApiInstance = axios.create();

export const login = (formData:any) => {
  return axiosApiInstance.post(serverUrl + "/loginAdmin", formData);
};

export const addUser = (formData:any) => {
  return axiosApiInstance.post(serverUrl + "/register", formData);
};

export const getUser = (query:any) => {
  return axiosApiInstance.get(`${serverUrl}/getUsers?${query}`);
};
export const getUserDetailsWithCampaigns = (id:any) => {
  return axiosApiInstance.get(`${serverUrl}/getUserDetailsWithCampaignsData/${id}`);
};

export const updateUserStatus = (id:any, formData:any) => {
  return axiosApiInstance.patch(`${serverUrl}/updateUserStatus/${id}`, formData);
};

export const deleteUser = (id:any) => {
  return axiosApiInstance.delete(`${serverUrl}/deleteById/${id}`);
};

export const getById = (id:any) => {
  return axiosApiInstance.get(`${serverUrl}/getById/${id}`);
};

export const updateUser = (formData:any, id:any) => {
  return axiosApiInstance.patch(`${serverUrl}/updateById/${id}`, formData);
};