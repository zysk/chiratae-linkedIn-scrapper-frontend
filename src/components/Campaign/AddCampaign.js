import moment from "moment";
import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import Select from "react-select";
import {
  campaignCheckLogin,
  campaignCreateForLinkedin,
  campaignLinkSearch,
  campaignScheduleForLinkedin,
  campaignSendCaptcha,
  campaignLinklogin,
  searchFromLinkedin,
  logoutAccount,
  addCampaignToQueue,
} from "../../services/Campaign.service";
import { getlinkedInAccount } from "../../services/LinkedInAccounts.service";
import { getproxies } from "../../services/Proxy.service";
import { getUser } from "../../services/users.service";
import { toastError } from "../../utils/toastUtils";
import { DashboardBox } from "../Utility/DashboardBox";
import { toastSuccess, toastWarning } from "../Utility/ToastUtils";
import { Input, TextField } from "@mui/material";
import styled from "@emotion/styled";

export default function AddCampaign() {
  let tempArr = [
    "Indian Institute of Technology Bombay,Indian Institute of Management Bangalore,Indian Institute of Technology Delhi,Indian Institute of Management Calcutta,Birla Institute of Technology and Science Pilani,Indian Institute of Technology Kanpur,Indian Institute of Technology (Banaras Hindu University) Varanasi,Indian Institute of Technology Palakkad,Indian Institute of Technology Indore,Indian Institute of Technology Mandi,Indian Institute of Technology Gandhinagar,Indian Institute of Technology Ropar,Indian Institute of Technology (Indian School of Mines) Dhanbad,Indian Institute of Technology Kharagpur,Indian Institute of Technology Madras,Indian Institute of Technology Roorkee,Indian Institute of Technology Guwahati,Indian Institute of Management Ahmedabad,Indian Institute of Technology (IIT) Goa,Indian Institute of Technology Jodhpur,Indian Institute of Technology Hyderabad,Indian Institute of Technology, Patna",
  ];

  let tempArr2 = [
    "Indian Institute of Technology Bombay",
    "Indian Institute of Management Bangalore",
    "Indian Institute of Technology Delhi",
    "Indian Institute of Management Calcutta",
    "Indian Institute of Technology Kanpur",
    "Indian Institute of Technology (Banaras Hindu University) Varanasi",
    "Indian Institute of Technology Palakkad",
    "Indian Institute of Technology Indore",
    "Indian Institute of Technology Mandi",
    "Indian Institute of Technology Gandhinagar",
    "Indian Institute of Technology Ropar",
    "Indian Institute of Technology (Indian School of Mines) Dhanbad",
    "Indian Institute of Technology Kharagpur",
    "Indian Institute of Technology Madras",
    "Indian Institute of Technology Roorkee",
    "Indian Institute of Technology Guwahati",
    "Indian Institute of Management Ahmedabad",
    "Indian Institute of Technology (IIT) Goa",
    "Indian Institute of Technology Jodhpur",
    "Indian Institute of Technology Hyderabad",
    "Indian Institute of Technology Patna",
    "Birla Institute of Technology and Science Pilani",
  ];

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

  const [useTextInputs, setUseTextInputs] = useState(true);

  const pageSource = ``;

  let schoolArr = [
    {
      label: `IIT`,
      value: "Indian institue of technology",
    },
    {
      label: `BITS`,
      value: "Birla Institute of Technology and Science",
    },
    {
      label: `IIM A`,
      value: "IIM A",
    },
    {
      label: `IIM B`,
      value: "IIM B",
    },
    {
      label: `IIM C`,
      value: "IIM C",
    },
    {
      label: `SRCC`,
      value: "Shri Ram College of Commerce",
    },
    {
      label: `LSR`,
      value: "Lady Shri Ram College",
    },
  ];

  let companyArr = [
    { label: `Stealth`, value: "Stealth" },
    { label: `Mckinsey`, value: "Mckinsey" },
    { label: `BCG`, value: "BCG" },
    { label: `Bain`, value: "Bain" },
    { label: `Flipkart`, value: "Flipkart" },
    { label: `Freshworks`, value: "Freshworks" },
    { label: `Zoho`, value: "Zoho" },
    { label: `Stealth Startup`, value: "Stealth Startup" },
    { label: `Stealth Company`, value: "Stealth Company" },
  ];

  useEffect(() => {
    let date = new Date();
    // date.setDate(date.getDate() + 1)
    let str = moment(date).format("YYYY-MM-DD");
    setScheduleMinDate(str);
    setScheduleDate(str);
  }, []);

  const handleBasicSearch = async () => {
    try {
      setImageData(null);
      setLoading(true);
      let obj = {
        name,
        oneTimeLink,
        searchQuery,
        page,
        company,
        school,
        pastCompany,
        linkedInAccountId,
        proxyId,
      };
      let { data: res } = await addCampaignToQueue(obj);
      if (res.message) {
        setLoading(false);
        toastSuccess(res.message);
      }
      console.log(res);
      toastSuccess(res.message);
      setDisableAllButton(true);
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
      setDisableAllButton(true);
      console.log(res.data);
      if (res.data.isCaptcha) {
        toastSuccess("Captcha Verification Needed");
        setImageData(res.data.imgUrl);
        setCaptchaMessage(res.data.captchaMessage);
      } else {
        toastSuccess("Login Successful");
        checkLoginOnInit();
        setImageData(null);
        setCaptchaMessage(null);
        setShowLogin(false);
      }
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
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
        setLoading(false);
      } else {
        toastSuccess(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
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
      setLoading(false);
      toastError(err);
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
      console.log(
        isLoggedIn,
        accountName == "" && password == "",
        isLoggedIn == false && accountName == "" && password == "",
        "av"
      );
      if (isLoggedIn == false && accountName == "" && password == "") {
        toastError("Please select account to login with");
        return;
      }

      let { data: res } = await campaignLinklogin({
        accountName,
        password: Buffer.from(password).toString("base64"),
      });
      if (res.isCaptcha || res.imgUrl) {
        toastSuccess("Captcha Verification Needed");
        console.log("res", res);
        setImageData(res.imgUrl);
        setCaptchaMessage(res.captchaMessage);
        setLoading(false);
      } else {
        toastSuccess("login Successfull");
        setIsLoggedIn(true);
        setShowLogin(false);
        setLoading(false);
      }
    } catch (err) {
      setLoading(true);
      toastError(err);
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
  const handleChangeProxyValue = (value) => {
    console.log(value);
    setProxyId(value.value);
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
                      Logout
                    </button>
                  </div>
                )}

                <div className="row d-flex justify-content-between mt-3 ">
                  <h3 className="col-6 blue-1 font6updateadmin mb-4">
                    Campaign for linkedIn
                  </h3>
                  <div className="col-3">
                    <Select
                      onChange={(e) => setUseTextInputs(e.value)}
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

                <h4 className="blue-1 font6updateadmin mb-4">Campaign Name</h4>

                <TextField
                  sx={{ borderRadius: 5 }}
                  id="outlined-basic"
                  label="Campaign Name"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter Campaign Name"
                  className="form-control muiinput"
                />
                <div className="col-lg-12 py-4">
                  <div className="borderbotm"></div>
                </div>
                {/* 
                            <h6 className="blue-1 mt-1">Or Input One Time Link</h6>
                            <input type="text" className='form-control' placeholder='One Time Link' value={oneTimeLink} onChange={(e) => setOneTimeLink(e.target.value)} />

                            <h4 className="blue-1 mt-3">Proxy Section</h4>
                            <Select onChange={handleChangeProxyValue} options={proxiesArr && proxiesArr.length > 0 ? proxiesArr.map(el => ({ label: `${el.value}`, value: el._id, ...el })) : []} />
                            */}

                {/* <hr /> */}
                <h4 className="blue-1 font6updateadmin mb-4">
                  Search query customization
                </h4>
                {/* <TextField id="outlined-basic" label="Search query" variant="outlined" placeholder='Enter Campaign Name' className='form-control muiinput' /> */}
                {/* <h6 className="blue-1 mt-2">Search query</h6> */}

                <div className="row">
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    <TextField
                      id="outlined-basic"
                      label="Search query"
                      variant="outlined"
                      className="form-control muiinput"
                      placeholder="Search Query"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6 col-sm-6 col-md-6">
                    {/* <TextField id="outlined-basic" label="Company" variant="outlined" className='form-control muiinput' placeholder='Search Query' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /> */}

                    {useTextInputs ? (
                      <TextField
                        id="outlined-basic"
                        label="Company"
                        variant="outlined"
                        className="form-control muiinput"
                        placeholder="Company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    ) : (
                      <Select
                        value={
                          company != ""
                            ? companyArr.find((el) => el.value == company)
                            : {}
                        }
                        onChange={(e) => setCompany(e.value)}
                        options={companyArr}
                      />
                    )}
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-6">
                    {useTextInputs ? (
                      <TextField
                        id="outlined-basic"
                        label="Past Company"
                        variant="outlined"
                        className="form-control muiinput"
                        placeholder="Past Company"
                        value={pastCompany}
                        onChange={(e) => setPastCompany(e.target.value)}
                      />
                    ) : (
                      <Select
                        value={
                          pastCompany != ""
                            ? companyArr.find((el) => el.value == company)
                            : {}
                        }
                        onChange={(e) => setPastCompany(e.value)}
                        options={companyArr}
                      />
                    )}
                  </div>
                  <div className="col-lg-6">
                    {useTextInputs ? (
                      <TextField
                        id="outlined-basic"
                        label="School"
                        variant="outlined"
                        className="form-control muiinput"
                        placeholder="School"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                      />
                    ) : (
                      <Select
                        value={
                          school != ""
                            ? schoolArr.find((el) => el.value == school)
                            : {}
                        }
                        onChange={(e) => setSchool(e.value)}
                        options={schoolArr}
                      />
                    )}
                  </div>
                </div>

                <div className="borderbotm mt-5"></div>

                {/* <input type="text" className='form-control' placeholder='Search Query' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /> */}

                {/* <h6 className="blue-1 mt-2">Company</h6> */}

                {/* <h6 className="blue-1 mt-2">Past Company</h6> */}

                {/* <h6 className="blue-1 mt-2">School</h6> */}

                {showLogin && (
                  <>
                    <hr />
                    <h4 className="blue-1">Account Section</h4>
                    <div className="row align-items-center">
                      <div className="col-6">
                        <Select
                          onChange={handleChangeValue}
                          options={
                            linkedInAccountArr && linkedInAccountArr.length > 0
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
                          disabled={loading}
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
                          {loading ? "Loading..." : "Login"}
                        </button>
                      </div>
                    </div>
                    <hr />
                  </>
                )}
                {showLogin == false && (
                  <>
                    <button
                      disabled={loading}
                      onClick={() => handleBasicSearch()}
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
                      {loading ? "Loading..." : "Start Searching"}
                    </button>
                    {/* <button disabled={loading} onClick={() => setSchedule(true)} type={"button"} style={{ outline: "none", width: 300, marginRight: 10, padding: "10px 70px", borderRadius: 10, border: "#D68392 solid 1px", marginTop: "15px", backgroundColor: 'white' }}>Set Schedule Date</button> */}
                  </>
                )}

                {showLogin && !imageData && (
                  <div className="row d-flex">
                    <button
                      disabled={loading}
                      onClick={() => handleBasicSearch()}
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
                    {/* <button disabled={loading} onClick={() => setSchedule(true)} type={"button"} style={{ outline: "none", width: 300, marginRight: 10, padding: "10px 70px", borderRadius: 10, border: "#D68392 solid 1px", marginTop: "15px", backgroundColor: 'white' }}>Set Schedule Date</button> */}
                  </div>
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
                    <h6 className="blue-1 mt-2">
                      {captchaMessage}
                    </h6>
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
              </DashboardBox>

              {/* <div>
                            <iframe src="http://httpbin.org/ip" frameborder="0" style={{ height: 300, width: 300 }} ></iframe>

                            <div dangerouslySetInnerHTML={{ __html: pageSource }} style={{ minHeight: 1000, minWidth: 1000 }} />

                        </div> */}
            </div>

            {/* <div className="col-12 col-lg-12" >
                        <DashboardBox className="dashboard-summary">
                            <h3 className="blue-1">Results     <b>Total results {resultObj?.totalResults}</b>  {loading && 'Loading...'}  </h3>
                            <hr />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">S.no</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Current Position & company</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Education</th>
                                        <th scope="col">Url</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        resultsArr && resultsArr.length > 0 && resultsArr.map((el, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{el?.name ? el?.name : "N.A."}</td>
                                                    <td>{el?.currentPosition ? el?.currentPosition : "N.A."}</td>
                                                    <td>{el?.location ? el?.location : "N.A."}</td>
                                                    <td>
                                                        <ul>
                                                            {
                                                                el?.educationArr && el?.educationArr.length > 0 ? el.educationArr.map((el, i) => {
                                                                    return (
                                                                        <li key={i}>{i + 1}.) {el}</li>
                                                                    )
                                                                })
                                                                    : "N.A."
                                                            }
                                                        </ul>

                                                    </td>
                                                    <td><a href={`${el?.link}`}>Visit Profile</a></td>
                                                </tr>
                                            )
                                        }
                                        )
                                    }
                                </tbody>
                            </table>


                        </DashboardBox>

                    </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}
