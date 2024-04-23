import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/leadStatus";

export const CreateLeadStatus = (formData) => {
    return axiosApiInstance.post(serverUrl + "/", formData);
};

export const getLeadStatus = (formData) => {
    return axiosApiInstance.get(serverUrl + "/", formData);
};

export const deleteLeadStatus = (id) => {
    return axiosApiInstance.delete(serverUrl + `/deleteById/${id}`);
};
