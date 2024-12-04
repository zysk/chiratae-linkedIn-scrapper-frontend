import moment from "moment";
import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import Select from "react-select";
import {
  campaignCheckLogin,
  campaignSendCaptcha,
  campaignLinklogin,
  logoutAccount,
  addCampaignToQueue,
  campaignVerifyOtp,
  campaignVerifyPhoneInteraction,
  resendPhoneVerification,
} from "../../services/Campaign.service";
import { getlinkedInAccount } from "../../services/LinkedInAccounts.service";
import { getproxies } from "../../services/Proxy.service";
import { toastError } from "../../utils/toastUtils";
import { DashboardBox } from "../Utility/DashboardBox";
import { toastSuccess, toastWarning } from "../Utility/ToastUtils";
import { TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function AddCampaign() {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [oneTimeLink, setOneTimeLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("co Founder");
  const [resultsArr, setResultsArr] = useState([]);
  const [page, setPage] = useState(1);

  const [school, setSchool] = useState(
    "Indian Institute of Technology Delhi,Indian Institute of Technology Patna,Indian Institute of Technology Kharagpur,Indian Institute of Technology Kanpur,Indian Institute of Technology Roorkee,Indian Institute of Technology Madras,Indian Institute of Technology Bombay,Indian Institute of Management Ahmedabad,Indian Institute of Management Bangalore,Indian Institute of Management Calcutta,Birla Institute of Technology and Science,Shri Ram College of Commerce,Lady Shri Ram College"
  );
  const [imageNumber, setImageNUmber] = useState(0);
  const [company, setCompany] = useState(
    "Stealth, Stealth startup, stealth company"
  );
  const [verification, setVerification] = useState({
    otpMessage: "",
    otpRequired: "",
  });
  const [otp, setOtp] = useState("");
  const [resultObj, setResultObj] = useState({});
  const [name, setName] = useState("");
  const [linkedInAccountId, setLinkedInAccountId] = useState("");
  const [linkedInAccountArr, setLinkedinAccountsArr] = useState([]);
  const [proxyId, setProxyId] = useState("");
  const [proxiesArr, setProxiesArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [scheduleMinDate, setScheduleMinDate] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [pastCompany, setPastCompany] = useState("");
  const [disableAllButton, setDisableAllButton] = useState(false);

  const [imageData, setImageData] = useState("");
  const [captchaMessage, setCaptchaMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [useTextInputs, setUseTextInputs] = useState(false);

  useEffect(() => {
    let date = new Date();
    // date.setDate(date.getDate() + 1)
    let str = moment(date).format("YYYY-MM-DD");
    setScheduleMinDate(str);
    setScheduleDate(str);
  }, []);

  const handleBasicSearch = async (data) => {
    try {
      setImageData(null);
      setLoading(true);
      let obj = {
        name: data.campaign_name,
        searchQuery: data.search_query,
        company: data.company,
        school: data.school,
        pastCompany: data.past_company,
        page,
        proxyId,
        oneTimeLink,
        linkedInAccountId,
      };
      let { data: res } = await addCampaignToQueue(obj);
      if (res.message) {
        setLoading(false);
        toastSuccess(res.message);
      }
      console.log(res);
      toastSuccess(res.message);
      setDisableAllButton(true);
      reset({});
    } catch (error) {
      setLoading(false);
      toastError(error);
    }
  };

  const handleCaptcha = async () => {
    setLoading(true);
    try {
      let obj = {
        imageNumber: imageNumber,
      };
      let res = await campaignSendCaptcha(obj);
      console.log("res", res);
      setDisableAllButton(true);

      if (res?.data?.error) {
        toastError(res?.data?.error);
        checkLoginOnInit();
      }
      if (res?.data?.isCaptcha == false && res?.data?.otpRequired == false) {
        checkLoginOnInit();
        toastSuccess("Login Successful");
        setImageData(null);
        setCaptchaMessage(null);
        setShowLogin(false);
      } else if (res.data.isCaptcha) {
        toastSuccess("Captcha Verification Needed");
        setImageData(res.data.imgUrl);
        setCaptchaMessage(res.data.captchaMessage);
      } else {
        setVerification({
          otpMessage: res.data?.otpMessage,
          otpRequired: res.data?.otpRequired,
        });
        // checkLoginOnInit();
        setImageData(null);
        setCaptchaMessage(null);
        setShowLogin(false);
      }
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      let obj = {
        otp,
      };
      let res = await campaignVerifyOtp(obj); // otpRequired: false
      // setDisableAllButton(true);
      console.log("ress", res);
      if (res?.data?.otpRequired == false) {
        setVerification({
          otpMessage: "",
          otpRequired: "",
        });
        checkLoginOnInit();
        toastSuccess("Login Successful");
      } else if (
        res?.data?.otpRequired == false &&
        res?.data?.isCaptcha == false &&
        res?.data?.phoneIntractionRequired == false
      ) {
        checkLoginOnInit();
        toastSuccess("Login Successful");
      }
      // setVerification(null);
    } catch (error) {
      console.log("ress", error);
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle phone interaction Button click
  const handlePhoneInteraction = async () => {
    setLoading(true);
    try {
      let res = await campaignVerifyPhoneInteraction();
      // setDisableAllButton(true);
      console.log(res.data);
      if (res?.data?.isLogin) {
        checkLoginOnInit();
      }
    } catch (error) {
      console.log("ress", error);
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Resend phone interaction notification
  const resendNotification = async () => {
    setLoading(true);
    try {
      let res = await resendPhoneVerification();
      console.log("ress", res);
    } catch (error) {
      console.log("ress", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLoginOnInit = async () => {
    try {
      setLoading(true);
      const res = await campaignCheckLogin();
      console.log(res.data.message, res.data);
      if (res.data.message) {
        setLoading(false);
      }

      setIsLoggedIn(res.data.isLogin);
      if (!res.data.isLogin) {
        toastWarning(res.data.message);
        setShowLogin(true);
        setVerification({
          phoneMessage: "",
          phoneIntractionRequired: "",
        });
        setLoading(false);
      } else {
        toastSuccess(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSearch = async () => {
  //     setLoading(true)
  //     try {
  //         let obj = {
  //             name,
  //             oneTimeLink,
  //             searchinPeople,
  //             accountName,
  //             password,
  //             searchQuery,
  //             page,
  //             company,
  //             school,
  //             linkedInAccountId,
  //             proxyId,
  //         }
  //         let { data: res } = await campaignLinklogin(obj)
  //         console.log("RESPONSE", res)
  //         if (res.isCaptcha || res.imgUrl) {
  //             toastSuccess("Captcha Verification Needed")
  //             setLoading(false)
  //             console.log("res", res)
  //             setImageData(res.imgUrl)
  //         }
  //         else {
  //             setLoading(false)
  //             toastSuccess("login Successfull")
  //             handleBasicSearch()
  //         }

  //         // let { data: res } = await campaignCreateForLinkedin(obj)
  //         // console.log(res)
  //         // if (res.data) {
  //         //     setResultObj(res.data);
  //         //     setResultsArr([...res.data.resultsArr]);
  //         // }
  //     }
  //     catch (err) {
  //         toastError(err)
  //     }
  //     setLoading(false)
  // }

  const handleScheduledSearch = async () => {
    try {
      setLoading(true);
      let obj = {
        name,
        oneTimeLink,
        accountName,
        password,
        searchQuery,
        page,
        company,
        school,
        linkedInAccountId,
        scheduled: true,
        proxyId,
        scheduleDate: moment(scheduleDate, "YYYY-MM-DD").toDate(),
      };

      let { data: res } = await addCampaignToQueue(obj);
      if (res.message) {
        setLoading(false);
        toastSuccess(res.message);
      }
      if (res.data) {
        setResultObj(res.data);
        setLoading(false);
        setResultsArr([...res.data.resultsArr]);
      }
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGet = async () => {
    try {
      setLoading(true);
      let { data: res } = await getlinkedInAccount();

      if (res.data) {
        setLoading(false);
        setLinkedinAccountsArr([...res.data]);
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  const handleGetProxies = async () => {
    try {
      let { data: res } = await getproxies();
      if (res.data) {
        setProxiesArr([...res.data]);
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (isLoggedIn == false && accountName == "" && password == "") {
        toastError("Please select account to login with");
        return;
      }

      let { data: res } = await campaignLinklogin({
        accountName,
        password: Buffer.from(password).toString("base64"),
      });

      if (res?.error) {
        toastError(res?.error);
        checkLoginOnInit();
      }

      if (res.captcha) {
        toastWarning("Captcha Verification Needed");
        console.log("res", res);
        setImageData(res.imgUrl);
        setCaptchaMessage(res.captchaMessage);
        setLoading(false);
      } else if (res?.otpRequired) {
        toastWarning("Otp Verification Needed");
        setVerification({
          otpMessage: res?.otpMessage,
          otpRequired: res?.otpRequired,
        });
        setLoading(false);
      } else if (res.phoneIntractionRequired) {
        toastWarning("Phone interaction Needed");
        setVerification({
          phoneMessage: res?.phoneMessage,
          phoneIntractionRequired: res?.phoneIntractionRequired,
        });
        setLoading(false);
      } else {
        toastSuccess("login Successfull");
        // setVerification(null);
        setIsLoggedIn(true);
        setShowLogin(false);
        setLoading(false);

        setImageData(null);
        setCaptchaMessage(null);
        checkLoginOnInit();
      }
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      let { data: res } = await logoutAccount();
      if (res.message) {
        setIsLoggedIn(res.isLogin);
        setShowLogin(true);
        toastSuccess(res.message);
        setLoading(false);
      }
    } catch (err) {
      setLoading(true);
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGet();
    handleGetProxies();
    checkLoginOnInit();
  }, []);

  const handleChangeValue = (value) => {
    console.log(value);
    setLinkedInAccountId(value.value);
    setAccountName(value.name);
    setPassword(value.password);
  };

  const getValidationSchema = () => {
    return useTextInputs ? schema : schemaDefault;
  };

  const schema = yup.object().shape({
    campaign_name: yup
      .string()
      .required("Campaign Name is Required")
      .min(3, "Campaign Name should be at least 3 characters")
      .max(50, "Campaign Name should not exceed 50 characters"),
    search_query: yup
      .string()
      .required("Search Query is Required")
      .min(3, "Search Query should be at least 3 characters")
      .max(50, "Search Query should not exceed 50 characters"),
    company: yup
      .string()
      .required("Company Name is Required")
      .min(3, "Company Name should be at least 3 characters")
      .max(50, "Company Name should not exceed 50 characters"),
    past_company: yup
      .string()
      .max(50, "Past Company Name should not exceed 50 characters"),
    school: yup
      .string()
      .required("School Name is Required")
      .min(3, "School Name should be at least 3 characters")
      .max(50, "School Name should not exceed 50 characters"),
  })

  const schemaDefault = yup.object().shape({
    campaign_name: yup
      .string()
      .required("Campaign Name is Required")
      .min(3, "Campaign Name should be at least 3 characters")
      .max(50, "Campaign Name should not exceed 50 characters"),
    search_query: yup
      .string()
      .required("Search Query is Required")
      .min(3, "Search Query should be at least 3 characters")
      .max(50, "Search Query should not exceed 50 characters"),
    company: yup.string().required("Company Name is Required"),
    past_company: yup.string(),
    school: yup.string().required("School Name is Required"),
  })

  const defaultValues = {
    campaign_name: "",
    search_query: "co Founder",
    company: "Stealth, Stealth startup, stealth company",
    past_company: "",
    school: "Indian Institute of Technology Delhi,Indian Institute of Technology Patna,Indian Institute of Technology Kharagpur,Indian Institute of Technology Kanpur,Indian Institute of Technology Roorkee,Indian Institute of Technology Madras,Indian Institute of Technology Bombay,Indian Institute of Management Ahmedabad,Indian Institute of Management Bangalore,Indian Institute of Management Calcutta,Birla Institute of Technology and Science,Shri Ram College of Commerce,Lady Shri Ram College"
  }

  const emptyValues = {
    campaign_name: "",
    search_query: "co Founder",
    company: "",
    past_company: "",
    school: ""
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: useTextInputs ? emptyValues : defaultValues
  })

  useEffect(() => {
    reset(useTextInputs ? emptyValues : defaultValues)
  }, [useTextInputs, reset])

  const onSubmitHandler = (data) => {
    handleBasicSearch(data);
  };
  return (
    <div className="newpaddingtoplefgt">
      <section className="mb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumarea">
                <h4>New Campaign</h4>
                <div className="breadcum">
                  <ul>
                    <li>Campaign</li>
                    <li className="active">New Champaign</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-12">
              <DashboardBox className="dashboard-summary dashboard-box">
                {isLoggedIn && (
                  <div className="row justify-content-end">
                    <button
                      onClick={() => handleLogout()}
                      type={"button"}
                      className={"align-self-end"}
                      style={{
                        outline: "none",
                        border: "none",
                        width: 300,
                        marginRight: 10,
                        padding: "7px 70px",
                        borderRadius: 10,
                      }}
                    >
                      {loading ? "Logging Out..." : "Logout"}
                    </button>
                  </div>
                )}

                <div className="row d-flex justify-content-between mt-3 ">
                  <h3 className="col-6 blue-1 font6updateadmin mb-4">
                    Campaign for linkedIn
                  </h3>
                  <div className="col-3">
                    <Select
                      onChange={(e) => {
                        setUseTextInputs(e.value);
                        reset({ company: "", past_company: "", school: "" });
                      }}
                      className="dropdownmenui"
                      defaultValue={{
                        label: `Use default inputs`,
                        value: false,
                      }}
                      options={[
                        { label: `Use default inputs`, value: false },
                        { label: `Add new inputs`, value: true },
                      ]}
                    />
                  </div>
                  <div className="col-lg-12 py-4">
                    <div className="borderbotm"></div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <h4 className="blue-1 font6updateadmin mb-4">
                    Campaign Name
                  </h4>
                  <Controller
                    name="campaign_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        sx={{ borderRadius: 5 }}
                        id="outlined-basic"
                        label="Campaign Name"
                        variant="outlined"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Enter Campaign Name"
                        className="form-control muiinput"
                      />
                    )}
                  />
                  {errors.campaign_name && (
                    <div className="text-danger mt-1">
                      {errors.campaign_name.message}
                    </div>
                  )}

                  <div className="col-lg-12 py-4">
                    <div className="borderbotm"></div>
                  </div>

                  <h4 className="blue-1 font6updateadmin mb-4">
                    Search query customization
                  </h4>

                  <div className="row">
                    <div className="col-lg-6 col-sm-6 col-md-6">
                      <Controller
                        name="search_query"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Search Query"
                            variant="outlined"
                            fullWidth
                            error={!!errors.search_query}
                            helperText={errors.search_query?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="col-lg-6 col-sm-6 col-md-6">

                      <Controller
                        name="company"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Company"
                            variant="outlined"
                            fullWidth
                            error={!!errors.company}
                            helperText={errors.company?.message}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="row mt-5">
                    <div className="col-lg-6">
                      <Controller
                        name="past_company"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Past Company"
                            variant="outlined"
                            fullWidth
                            error={!!errors.past_company}
                            helperText={errors.past_company?.message}
                          />
                        )}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Controller
                        name="school"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="School"
                            variant="outlined"
                            fullWidth
                            error={!!errors.school}
                            helperText={errors.school?.message}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="borderbotm mt-5"></div>

                  {!showLogin && (
                    <>
                      <hr />
                      <h4 className="blue-1">Account Section</h4>
                      <div className="row align-items-center">
                        <div className="col-6">
                          <Select
                            onChange={handleChangeValue}
                            options={
                              linkedInAccountArr &&
                                linkedInAccountArr.length > 0
                                ? linkedInAccountArr.map((el) => ({
                                  label: `${el.name}`,
                                  value: el._id,
                                  ...el,
                                }))
                                : []
                            }
                          />
                        </div>
                        <div className="col-6">
                          <button
                            disabled={loading || !showLogin}
                            onClick={() => handleLogin()}
                            type={"button"}
                            style={{
                              outline: "none",
                              border: "none",
                              width: 300,
                              marginRight: 10,
                              padding: "7px 70px",
                              borderRadius: 10,
                              backgroundColor: "#D68392",
                              color: "white",
                            }}
                          >
                            {loading ? "Logging..." : "Login"}
                          </button>
                        </div>
                      </div>
                      <hr />
                    </>
                  )}
                  {/* hanlde search submit button */}
                  {(showLogin == false || (showLogin && !imageData)) && (
                    <>
                      <button
                        disabled={isSubmitting || !isValid}
                        type={"submit"}
                        className={`${!isValid || showLogin || isSubmitting ? "cursor-not-allowed" : ""
                          }`}
                        style={{
                          outline: "none",
                          border: "none",
                          width: 300,
                          marginRight: 10,
                          padding: "10px 70px",
                          borderRadius: 10,
                          backgroundColor: "#D68392",
                          marginTop: "15px",
                          color: "white",
                        }}
                      >
                        {loading ? "Searching..." : "Start Searching"}
                      </button>
                      {!showLogin && (
                        <>
                          <p className="fw-bold" style={{ marginBottom: 0 }}>
                            <i
                              className="fa fa-info-circle"
                              aria-hidden="true"
                            />{" "}
                            Linked Login is required to proceed with New
                            Campaign Creation
                          </p>
                          <p className="fw-bold">
                            <i
                              className="fa fa-info-circle"
                              aria-hidden="true"
                            />{" "}
                            Please make sure to turn off two step verification
                            before login
                          </p>
                        </>
                      )}
                    </>
                  )}

                  {showLogin && !!imageData && (
                    <>
                      <h6 className="blue-1 mt-2">Captcha Required</h6>
                      <img
                        src={imageData}
                        alt=""
                        srcset=""
                        style={{ height: 200, width: 300 }}
                      />
                      <h6 className="blue-1 mt-2">{captchaMessage}</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter correct image number"
                        value={imageNumber}
                        onChange={(e) => setImageNUmber(e.target.value)}
                      />
                      <button
                        onClick={() => handleCaptcha()}
                        type={"button"}
                        style={{
                          outline: "none",
                          border: "none",
                          width: 300,
                          marginRight: 10,
                          padding: "10px 70px",
                          borderRadius: 10,
                          backgroundColor: "#D68392",
                          marginTop: "15px",
                          color: "white",
                        }}
                      >
                        {loading ? "Loading..." : "Run Now"}
                      </button>
                    </>
                  )}

                  {verification?.otpRequired && (
                    <>
                      <h6 className="blue-1 mt-2">OTP Required</h6>
                      <h6 className="blue-1 mt-2">{verification.otpMessage}</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter correct otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button
                        onClick={() => handleOtpVerification()}
                        type={"button"}
                        style={{
                          outline: "none",
                          border: "none",
                          width: 300,
                          marginRight: 10,
                          padding: "10px 70px",
                          borderRadius: 10,
                          backgroundColor: "#D68392",
                          marginTop: "15px",
                          color: "white",
                        }}
                      >
                        {loading ? "Loading..." : "Run Now"}
                      </button>
                    </>
                  )}

                  {/* For Phone interaction */}
                  {verification.phoneIntractionRequired && !isLoggedIn ? (
                    <>
                      <h6 className="blue-1 mt-2">
                        Click on the button below once the verification is done.
                      </h6>
                      <h6 className="blue-1 mt-2">
                        {verification.phoneMessage}
                      </h6>

                      <button
                        onClick={() => handlePhoneInteraction()}
                        type={"button"}
                        style={{
                          outline: "none",
                          border: "none",
                          width: 300,
                          marginRight: 10,
                          padding: "10px 70px",
                          borderRadius: 10,
                          backgroundColor: "#D68392",
                          marginTop: "15px",
                          color: "white",
                        }}
                      >
                        {loading ? "Loading..." : "Verified"}
                      </button>

                      <button
                        onClick={() => resendNotification()}
                        type={"button"}
                        style={{
                          outline: "none",
                          border: "none",
                          width: 300,
                          marginRight: 10,
                          padding: "10px 70px",
                          borderRadius: 10,
                          backgroundColor: "#D68392",
                          marginTop: "15px",
                          color: "white",
                        }}
                      >
                        {loading ? "Sending..." : "Resend Notification"}
                      </button>
                    </>
                  ) : null}
                  {/* End */}

                  {/* hanlde search submit button */}
                  {schedule && (
                    <div
                      className="mt-4"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={() => setScheduleDate(scheduleDate)}
                        className="form-control"
                        style={{ width: "unset" }}
                        min={scheduleMinDate}
                      />
                      <button
                        onClick={() => handleScheduledSearch()}
                        type={"button"}
                        style={{
                          outline: "none",
                          border: "none",
                          width: 300,
                          marginLeft: 10,
                          marginRight: 10,
                          padding: "5px 70px",
                          borderRadius: 10,
                          backgroundColor: "#D68392",
                          color: "white",
                        }}
                      >
                        Schedule for later
                      </button>
                    </div>
                  )}
                </form>
              </DashboardBox>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
