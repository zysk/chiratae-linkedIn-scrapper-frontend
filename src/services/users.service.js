import axios from "axios";
import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/users";

export const login = (formData) => {
  return axiosApiInstance.post(serverUrl + "/loginAdmin", formData);
};

export const addUser = (formData) => {
  return axiosApiInstance.post(serverUrl + "/register", formData);
};

export const getUser = (query) => {
  return axiosApiInstance.get(`${serverUrl}/getUsers?${query}`);
};
export const getUserDetailsWithCampaigns = (id) => {
  return axiosApiInstance.get(`${serverUrl}/getUserDetailsWithCampaignsData/${id}`);
};

export const updateUserStatus = (id, formData) => {
  return axiosApiInstance.patch(`${serverUrl}/updateUserStatus/${id}`, formData);
};

export const deleteUser = (id) => {
  return axiosApiInstance.delete(`${serverUrl}/deleteById/${id}`);
};

export const getById = (id) => {
  return axiosApiInstance.get(`${serverUrl}/getById/${id}`);
};

export const updateUser = (formData, id) => {
  return axiosApiInstance.patch(`${serverUrl}/updateById/${id}`, formData);
};