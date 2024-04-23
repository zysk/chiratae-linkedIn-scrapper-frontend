import axios from "axios";
import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/proxies";

export const createproxies = (formData) => {
    return axiosApiInstance.post(serverUrl + "/", formData);
};

export const getproxies = (formData) => {
    return axiosApiInstance.get(serverUrl + "/", formData);
};

export const deleteproxies = (id) => {
    return axiosApiInstance.delete(serverUrl + `/deleteById/${id}`);
};