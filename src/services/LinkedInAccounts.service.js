import axios from "axios";
import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/linkedInAccount";

export const createlinkedInAccount = (formData) => {
    return axiosApiInstance.post(serverUrl + "/", formData);
};

export const getlinkedInAccount = (formData) => {
    return axiosApiInstance.get(serverUrl + "/", formData);
};

export const deletelinkedInAccount = (id) => {
    return axiosApiInstance.delete(serverUrl + `/deleteById/${id}`);
};
