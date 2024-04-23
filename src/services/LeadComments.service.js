import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/leadComments";


export const addLeadComment = (obj) => {
    return axiosApiInstance.post(serverUrl + `/`, obj);
};
export const getLeadComments = (id) => {
    return axiosApiInstance.get(serverUrl + `/getByLeadId/${id}`);
};