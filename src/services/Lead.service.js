import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/lead";


export const getLeads = (formData) => {
    return axiosApiInstance.get(serverUrl + `/?${formData}`);
};
export const getLeadById = (id) => {

    return axiosApiInstance.get(serverUrl + `/getById/${id}`);

};

export const assignLeadToUser = (leadId, formData) => {
    return axiosApiInstance.patch(serverUrl + `/assignLeadToUser/${leadId}`, formData);
};


export const automaticallyAssignLeadsToUser = () => {
    return axiosApiInstance.patch(serverUrl + `/automaticallyAssignLeadsToUser`);
};


export const automaticallyAssignLeadsToSelectedUsers = (obj) => {
    return axiosApiInstance.patch(serverUrl + `/automaticallyAssignLeadsToSelectedUsers`, obj);
};



export const changeLeadStatus = (leadId, formData) => {
    return axiosApiInstance.patch(serverUrl + `/changeLeadStatus/${leadId}`, formData);
};
export const changeLeadRating = (leadId, formData) => {
    return axiosApiInstance.patch(serverUrl + `/changeLeadRating/${leadId}`, formData);
};

export const deleteLead = (id) => {
    return axiosApiInstance.delete(serverUrl + `/deleteById/${id}`);
};



