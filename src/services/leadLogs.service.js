import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/leadlogs";


export const getLeadLogs = (id) => {
    return axiosApiInstance.get(serverUrl + `/getByLeadId/${id}`);
};