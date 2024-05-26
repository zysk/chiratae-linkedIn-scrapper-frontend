import axios from "axios";
import { axiosApiInstance } from "../App";
import { url } from "./url.service";

const serverUrl = url + "/campaign";

export const campaignCreateForLinkedin = (formData) => {
    return axiosApiInstance.post(serverUrl + "/campaignLinkedin", formData, { timeout: 10000000000000 });
};

export const campaignCheckLogin = () => {
    return axiosApiInstance.post(serverUrl + "/linkchecklogin", { timeout: 10000000000000 });
};
export const addDealToSavanta = (id) => {
    return axiosApiInstance.post(serverUrl + `/addDealToSavanta/${id}`, { timeout: 10000000000000 });
};

export const addCampaignToQueue = (obj) => {
    return axiosApiInstance.post(serverUrl + `/addCampaignToQueue`, obj, { timeout: 10000000000000 });
};

export const linkedInProfileScrapping = () => {
    return axiosApiInstance.post(serverUrl + "/linkedInProfileScrapping", { timeout: 10000000000000 });
}

export const continueScheduledAfterLogin = (endDate) => {
    return axiosApiInstance.post(serverUrl + `/continueScheduled?endDate=${endDate}`, { timeout: 10000000000000 });
};

export const logoutAccount = (formData) => {
    return axiosApiInstance.post(serverUrl + "/logoutAndLogoutAnotherAccount", formData, { timeout: 10000000000000 });
};
export const campaignLinklogin = (formData) => {
    return axiosApiInstance.post(serverUrl + "/linklogin", formData, { timeout: 10000000000000 });
};

export const campaignSendCaptcha = (formData) => {
    return axiosApiInstance.post(serverUrl + "/linkCaptcha", formData, { timeout: 10000000000000 });
};

export const campaignVerifyOtp = (formData) => {
  return axiosApiInstance.post(serverUrl + "/verifyOtp", formData, {
    timeout: 10000000000000,
  });
};

export const campaignLinkSearch = (formData) => {
    return axiosApiInstance.post(serverUrl + "/linkSearch", formData, { timeout: 10000000000000 });
};

export const campaignScheduleForLinkedin = (formData) => {
    return axiosApiInstance.post(serverUrl + "/campaignScheduleLinkedin", formData);
};

export const getcampaigns = (formData) => {
    return axiosApiInstance.get(serverUrl + "/getcampaigns", formData);
};

export const getPastcampaignById = (id) => {
    return axiosApiInstance.get(serverUrl + `/getPastcampaignById/${id}`);
};
