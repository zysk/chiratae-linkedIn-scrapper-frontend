
import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/customemail";


export const addcustomemail = (obj) => {
    return axiosApiInstance.post(serverUrl + `/`, obj);
};
export const getcustomemail = () => {
    return axiosApiInstance.get(serverUrl + `/`);
};
