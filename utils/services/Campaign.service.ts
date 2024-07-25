import axiosInstance from './axiosInstance'

const BASE_URL_PATH = process.env.NEXT_PUBLIC_BASE_URL;
const serverUrl = BASE_URL_PATH + "/campaign";

export const campaignCreateForLinkedin = (formData:any) => {
    return axiosInstance.post(serverUrl + "/campaignLinkedin", formData, { timeout: 10000000000000 });
};

export const campaignCheckLogin = () => {
    return axiosInstance.post(serverUrl + "/linkchecklogin", { timeout: 10000000000000 });
};
export const addDealToSavanta = (id: any) => {
    return axiosInstance.post(serverUrl + `/addDealToSavanta/${id}`, { timeout: 10000000000000 });
};

export const addCampaignToQueue = (obj: any) => {
    return axiosInstance.post(serverUrl + `/addCampaignToQueue`, obj, { timeout: 10000000000000 });
};

export const linkedInProfileScrapping = () => {
    return axiosInstance.post(serverUrl + "/linkedInProfileScrapping", { timeout: 10000000000000 });
}

export const continueScheduledAfterLogin = (endDate: any) => {
    return axiosInstance.post(serverUrl + `/continueScheduled?endDate=${endDate}`, { timeout: 10000000000000 });
};

export const logoutAccount = () => {
    return axiosInstance.post(serverUrl + "/logoutAndLogoutAnotherAccount", { timeout: 10000000000000 });
};
export const campaignLinklogin = (formData: any) => {
    return axiosInstance.post(serverUrl + "/linklogin", formData, { timeout: 10000000000000 });
};

export const campaignSendCaptcha = (formData: any) => {
    return axiosInstance.post(serverUrl + "/linkCaptcha", formData, { timeout: 10000000000000 });
};

export const campaignVerifyOtp = (formData: any) => {
  return axiosInstance.post(serverUrl + "/verifyOtp", formData, {
    timeout: 10000000000000,
  });
};

export const campaignLinkSearch = (formData: any) => {
    return axiosInstance.post(serverUrl + "/linkSearch", formData, { timeout: 10000000000000 });
};

export const campaignScheduleForLinkedin = (formData: any) => {
    return axiosInstance.post(serverUrl + "/campaignScheduleLinkedin", formData);
};

export const getcampaigns = (formData: any) => {
    return axiosInstance.get(serverUrl + "/getcampaigns", formData);
};

export const getPastcampaignById = (id: any) => {
    return axiosInstance.get(serverUrl + `/getPastcampaignById/${id}`);
};
