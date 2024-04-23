
import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/emailSettings";


export const addEmailSettings = (obj) => {
    return axiosApiInstance.post(serverUrl + `/`, obj);
};
export const getEmailSettings = () => {
    return axiosApiInstance.get(serverUrl + `/`);
};