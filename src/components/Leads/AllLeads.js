import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  assignLeadToUser,
  automaticallyAssignLeadsToSelectedUsers,
  automaticallyAssignLeadsToUser,
  changeLeadStatus,
  getLeads,
} from "../../services/Lead.service";
import { getUser } from "../../services/users.service";
import { toastSuccess } from "../../utils/toastUtils";
import ActionIcon from "../Utility/ActionIcon";
import CustomButton from "../Utility/Button";
import { DashboardTable } from "../Utility/DashboardBox";
import { toastError } from "../Utility/ToastUtils";
import { Modal, Box } from "@mui/material";
import Select from "react-select";
import MuiSelect from "@mui/material/Select";
import { useSelector } from "react-redux";
import { leadStatusObj } from "../../utils/LeadStatus";
import { getLeadLogs } from "../../services/leadLogs.service";
import { Input, TextField } from "@mui/material";
// import { BiSearch } from 'react-icons/bi';
// import Box from '@mui/material/Box';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {
  addLeadComment,
  getLeadComments,
} from "../../services/LeadComments.service";
import { DisplayDate } from "../../utils/DateUtils";
import { getLeadStatus } from "../../services/LeadStatus.service";
import { Navigate, useNavigate } from "react-router-dom";
import ReactSelect from "react-select";

import { debounce } from "lodash";
import axios from "axios";
import moment from "moment";

const schoolOptions = [
  { label: "UnSelect", value: "" },
  {
    label: "IITs",
    value: "IIT,indian institute of technology",
  },
  { label: "BITS", value: "BITS, birla institue" },
  {
    label: "IIM A",
    value: "IIM A, indian institue of management ahemdabad",
  },
  {
    label: "IIM B",
    value: "IIM B , indian institue of management bengalore",
  },
  {
    label: "IIM C",
    value: "IIM C, indian institue of management Calcutta",
  },
  {
    label: "SRCC",
    value: "SRCC , Shri Ram College of Commerce",
  },
  { label: "LSR", value: "LSR, Lady Shri Ram" },
];

export default function AllLeads() {
  const companyoptions = [
    { label: "Stealth", value: "Stealth" },
    {
      label: "Stealth Startup",
      value: "Stealth Startup",
    },
    {
      label: "Stealth Company",
      value: "Stealth Company",
    },
    { label: "Mckinsey", value: "Mckinsey" },
    { label: "BCG", value: "BCG" },
    { label: "Bain", value: "Bain" },
    { label: "Flipkart", value: "Flipkart" },
    { label: "Freshworks", value: "Freshworks" },
    { label: "Zoho", value: "Zoho" },
  ];

  let user = useSelector((state) => state.auth.user);
  let role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [selectUsersModal, setSelectUsersModal] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const textInputRef = useRef();

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSchool, setSelectedSchool] = useState("");
  const [companyOptions, setCompanyOptions] = useState("");

  const [selectedCompany, setSelectedCompany] = useState("");

  const [filterSelected, setFilterSelected] = useState("all");
  const [selectedLead, setSelectedLead] = useState({});
  const [leadsArr, setLeadsArr] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [ModalBox, setModalBox] = useState(false);
  const [leadDetailsModal, setLeadDetailsModal] = useState(false);
  const [userArr, setUserArr] = useState([]);
  const [leadsMainArr, setLeadsMainArr] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [leadDetailsVisible, setLeadDetailsVisible] = useState(1);
  const [leadHistoryArr, setLeadHistoryArr] = useState([]);
  const [leadCommentsArr, setLeadCommentsArr] = useState([]);
  const [leadComment, setLeadComment] = useState("");
  const commentsContainer = useRef();
  const [leadsStatusArr, setLeadsStatusArr] = useState([]);
  const [updateDate, setUpdateDate] = useState(new Date());
  const handleGetLeads = async (
    skipValue,
    limitValue,
    filterCondition,
    searchQueryValue,
    school,
    company
  ) => {
    try {
      setLoading(true);
      let query = `skip=${skipValue}&limit=${limitValue}&role=${role}`;

      if (role != "ADMIN") {
        query = `${query}&userId=${user._id}`;
      }
      if (filterCondition) {
        query = `${query}&filter=${filterCondition}`;
      }
      if (searchQueryValue) {
        query = `${query}&searchQueryValue=${searchQueryValue}`;
      }
      if (school) {
        query = `${query}&school=${school}`;
      }
      if (company) {
        query = `${query}&company=${company}`;
      }

      let { data: res } = await getLeads(query);
      if (res.data) {
        setLoading(false);
        console.log(res.data);
        setTotalElements(res.totalLeads);
        setLeadsArr(res.data);
        setLeadsMainArr(res.data);
        if (textInputRef) {
          textInputRef?.current?.focus();
        }
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  const handleAssignLeadToUser = async () => {
    try {
      if (selectedLeadId == "") {
        toastError("Please select a Lead");
        return;
      } else if (selectedUserId == "") {
        toastError("Please select a User");
        return;
      }

      let { data: res } = await assignLeadToUser(selectedLeadId, {
        userId: selectedUserId,
      });
      if (res.message) {
        toastSuccess(res.message);
        handleGetLeads(
          limit * page,
          limit,
          filterSelected,
          searchQuery && searchQuery != "" ? searchQuery : null,
          selectedSchool ? selectedSchool : null,
          selectedCompany ? selectedCompany : null
        );
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleAssignLeadToSelectedUsers = async () => {
    try {
      let obj = {
        usersArr: selectedUsers,
      };
      let { data: res } = await automaticallyAssignLeadsToSelectedUsers(obj);
      if (res.message) {
        toastSuccess(res.message);
        handleGetLeads(
          limit * page,
          limit,
          filterSelected,
          searchQuery && searchQuery != "" ? searchQuery : null,
          selectedSchool ? selectedSchool : null,
          selectedCompany ? selectedCompany : null
        );
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleGet = async () => {
    try {
      let { data: res } = await getUser(`role=USER`);
      if (res.success) {
        setUserArr(res.data);
      }
    } catch (err) {
      toastError(err);
    }
    // dispatch(CATEGORYAdd(obj));
  };

  const [category_columns, setCategory_columns] = useState([
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "5%",
    },
    // {
    //     name: "Campaign Name",
    //     selector: (row) => row?.campaignObj?.name,
    //     width: "10%"

    // },
    {
      name: "Founder Name",
      cell: (row) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleRedirect(row?._id)}
        >
          {" "}
          {row?.clientObj?.name}{" "}
        </div>
      ),
      width: "12%",
    },
    {
      name: "Current Company",
      cell: (row) => (
        <div style={{ flex: "flex", flexWrap: "wrap" }}>{`${
          row?.clientObj?.experienceArr?.length > 0
            ? `${row?.clientObj?.experienceArr[0]?.companyDetail} | ${row?.clientObj?.experienceArr[0]?.company}`
            : "NA"
        }`}</div>
      ),
      width: "14%",
    },
    {
      name: "Previous Company",
      cell: (row) => (
        <div style={{ flex: "flex", flexWrap: "wrap" }}>{`${
          row?.clientObj?.experienceArr?.length > 1
            ? `${row?.clientObj?.experienceArr[1]?.companyDetail} | ${row?.clientObj?.experienceArr[1]?.company}`
            : "NA"
        }`}</div>
      ),
      width: "14%",
    },
    // {
    //     name: "Lead Assigned to",
    //     selector: (row) => row?.leadAssignedToObj?.name ? row?.leadAssignedToObj?.name : "N.A.",
    //     width: "12%"
    // },
    {
      name: "Last Updated On",
      selector: (row) => `${new Date(row?.createdAt).toDateString()}`,
      width: "12%",
    },
    {
      name: "Rating",
      selector: (row) => `${row.rating}`,
      width: "12%",
    },
    {
      name: "Status",
      width: "15%",
      cell: (row) => (
        <div style={{ width: 170 }}>
          {" "}
          <Select
            value={{ label: row.status, value: row.status }}
            onChange={(e) => {
              console.log(e);
              handleStatusChange(e.value, row);
            }}
            options={
              leadsStatusArr.map((el) => ({ label: el.value, value: el.value }))
              //     [
              //     { label: leadStatusObj.CLOSED, value: leadStatusObj.CLOSED },
              //     { label: leadStatusObj.CONTACTAGAIN, value: leadStatusObj.CONTACTAGAIN },
              //     { label: leadStatusObj.CREATED, value: leadStatusObj.CREATED },
              //     { label: leadStatusObj.DORMANT, value: leadStatusObj.DORMANT },
              //     { label: leadStatusObj.WORKINPROGRESS, value: leadStatusObj.WORKINPROGRESS },
              // ]
            }
          />
        </div>
      ),
    },
    {
      name: "Visit",
      cell: (row) => (
        <a
          className="btn btn-1 text-white"
          target={"_blank"}
          href={`${row.clientObj?.link}`}
        >
          Visit
        </a>
      ),
      width: "10%",
    },
  ]);

  useEffect(() => {
    setCategory_columns([
      {
        name: "ID",
        selector: (row, index) => index + 1,
        sortable: true,
        width: "5%",
      },
      // {
      //     name: "Campaign Name",
      //     selector: (row) => row?.campaignObj?.name,
      //     width: "10%"

      // },
      {
        name: "Founder Name",
        cell: (row) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleRedirect(row?._id)}
          >
            {" "}
            {row?.clientObj?.name}{" "}
          </div>
        ),
        width: "12%",
      },
      {
        name: "Current Company",
        cell: (row) => (
          <div style={{ flex: "flex", flexWrap: "wrap" }}>{`${
            row?.clientObj?.experienceArr?.length > 0
              ? `${row?.clientObj?.experienceArr[0]?.companyDetail} | ${row?.clientObj?.experienceArr[0]?.company}`
              : "NA"
          }`}</div>
        ),
        width: "14%",
      },
      {
        name: "Previous Company",
        cell: (row) => (
          <div style={{ flex: "flex", flexWrap: "wrap" }}>{`${
            row?.clientObj?.experienceArr?.length > 1
              ? `${row?.clientObj?.experienceArr[1]?.companyDetail} | ${row?.clientObj?.experienceArr[1]?.company}`
              : "NA"
          }`}</div>
        ),
        width: "14%",
      },
      // {
      //     name: "Lead Assigned to",
      //     selector: (row) => row?.leadAssignedToObj?.name ? row?.leadAssignedToObj?.name : "N.A.",
      //     width: "12%"
      // },
      {
        name: "Last Updated On",
        selector: (row) => `${new Date(row?.createdAt).toDateString()}`,
        width: "12%",
      },
      {
        name: "Rating",
        selector: (row) => `${row.rating}`,
        width: "12%",
      },
      {
        name: "Status",
        width: "15%",
        cell: (row) => (
          <div style={{ width: 170 }}>
            {" "}
            <Select
              value={{ label: row.status, value: row.status }}
              onChange={(e) => {
                console.log(e);
                handleStatusChange(e.value, row);
              }}
              options={
                leadsStatusArr.map((el) => ({
                  label: el.value,
                  value: el.value,
                }))
                //     [
                //     { label: leadStatusObj.CLOSED, value: leadStatusObj.CLOSED },
                //     { label: leadStatusObj.CONTACTAGAIN, value: leadStatusObj.CONTACTAGAIN },
                //     { label: leadStatusObj.CREATED, value: leadStatusObj.CREATED },
                //     { label: leadStatusObj.DORMANT, value: leadStatusObj.DORMANT },
                //     { label: leadStatusObj.WORKINPROGRESS, value: leadStatusObj.WORKINPROGRESS },
                // ]
              }
            />
          </div>
        ),
      },
      {
        name: "Visit",
        cell: (row) => (
          <a
            className="btn btn-1 text-white"
            target={"_blank"}
            href={`${row.clientObj?.link}`}
          >
            Visit
          </a>
        ),
        width: "10%",
      },
    ]);
  }, [category_columns, leadsStatusArr]);

  useEffect(() => {
    if (category_columns.some((el) => el.name != "Action")) {
      if (role == "ADMIN") {
        let temp = category_columns;
        temp.push({
          name: "Action",
          cell: (row) => (
            <>
              <CustomButton
                btntype="button"
                changeClass="btn btn-2"
                ClickEvent={() => {
                  setModalBox(true);
                  setSelectedLeadId(row._id);
                }}
                noIcon
                btnName={
                  row?.leadAssignedToObj?.name
                    ? "Assign Lead to other user"
                    : "Assign Lead to user"
                }
                isBtn
                small={true}
              />
              {/* <CustomButton btntype="button" changeClass="ms-4 btn " ClickEvent={() => { setLead  tailsModal(true); setLeadDetailsVisible(0); setSelectedLead(row) }} noIcon btnName={"View Details"} isBtn small={true} /> */}
            </>
          ),
          width: "25%",
        });
        setCategory_columns([...temp]);
      }
    }
  }, []);

  const handleStatusChange = async (value, originalObj) => {
    try {
      let obj = {
        status: value,
      };
      let { data: res } = await changeLeadStatus(originalObj._id, obj);
      if (res.message) {
        toastSuccess(res.message);
        handleGetLeads(
          limit * page,
          limit,
          null,
          searchQuery && searchQuery != "" ? searchQuery : null,
          selectedSchool ? selectedSchool : null,
          selectedCompany ? selectedCompany : null
        );
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleChangeValue = (e) => {
    console.log(e.value, "value");
    setSelectedUserId(e.value);
  };

  useEffect(() => {
    handleGetLeads(
      limit * page,
      limit,
      filterSelected,
      searchQuery && searchQuery != "" ? searchQuery : null,
      selectedSchool ? selectedSchool : null,
      selectedCompany ? selectedCompany : null
    );
    handleGet();
    handleGetLeadStatus();
  }, []);

  // useEffect(() => {
  // if (filterSelected != "" && leadsMainArr) {
  // handleFilter(filterSelected)
  // }
  // }, [filterSelected, leadsMainArr])
  const handleFilter = (value) => {
    if (value == "assigned") {
      handleGetLeads(
        limit * page,
        limit,
        "assigned",
        searchQuery && searchQuery != "" ? searchQuery : null,
        selectedSchool ? selectedSchool : null,
        selectedCompany ? selectedCompany : null
      );
      setPage(0);
    } else if (value == "un-assigned") {
      handleGetLeads(
        limit * page,
        limit,
        "un-assigned",
        searchQuery && searchQuery != "" ? searchQuery : null,
        selectedSchool ? selectedSchool : null,
        selectedCompany ? selectedCompany : null
      );
      setPage(0);
    } else if (value == "all") {
      handleGetLeads(
        limit * page,
        limit,
        "all",
        searchQuery && searchQuery != "" ? searchQuery : null,
        selectedSchool ? selectedSchool : null,
        selectedCompany ? selectedCompany : null
      );
      setPage(0);
    }
  };

  const handleGetLeadHistory = async () => {
    try {
      setLoading(true);
      let { data: res } = await getLeadLogs(selectedLead._id);
      if (res.data) {
        setLoading(false);
        setLeadHistoryArr(res.data);
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  const handleGetLeadStatus = async () => {
    try {
      setLoading(true);

      let { data: res } = await getLeadStatus();
      if (res.data) {
        setLoading(false);
        setLeadsStatusArr(res.data);
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  const handleAddComment = async () => {
    try {
      setLoading(true);

      let obj = {
        message: leadComment,
        leadId: selectedLead._id,
      };
      let { data: res } = await addLeadComment(obj);
      if (res.message) {
        setLoading(false);
        toastSuccess(res.message);
        handlegetComment();
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  const handlegetComment = async () => {
    try {
      setLoading(true);
      let { data: res } = await getLeadComments(selectedLead._id);
      if (res.data) {
        setLoading(false);
        setLeadCommentsArr(res.data);
        commentsContainer.current?.scrollIntoView({
          block: "end",
          inline: "nearest",
        });
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  const handleAllotAllLeads = async () => {
    try {
      setLoading(true);
      let { data: res } = await automaticallyAssignLeadsToUser();
      if (res.message) {
        toastSuccess(res.message);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  const handlePerRowsChange = (newPerPage, page) => {
    handleGetLeads(
      newPerPage * (page - 1),
      newPerPage,
      filterSelected,
      searchQuery && searchQuery != "" ? searchQuery : null,
      selectedSchool ? selectedSchool : null,
      selectedCompany ? selectedCompany : null
    );
    setLimit(newPerPage);
  };
  const handlePageChange = (page) => {
    console.log(page, "handlePageChange");
    if (totalElements / page > 1) {
      setPage(page - 1);
      handleGetLeads(
        limit * (page - 1),
        limit,
        filterSelected,
        searchQuery && searchQuery != "" ? searchQuery : null,
        selectedSchool ? selectedSchool : null,
        selectedCompany ? selectedCompany : null
      );
    }
  };

  useEffect(() => {
    if (commentsContainer.current) {
      commentsContainer.current?.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
  }, [commentsContainer.current]);
  useEffect(() => {
    if (selectedLead && selectedLead != "" && selectedLead._id) {
      handleGetLeadHistory();
      handlegetComment();
    }
  }, [selectedLead]);

  const handleRedirect = (id) => {
    navigate(`/User-details/${id}`);
  };

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        color: "#757474",
      },
    },
  };

  const debouncedSave = useCallback(
    // skipValue, limitValue, filterCondition, searchQueryValue, school, company
    debounce(
      (nextValue) =>
        handleGetLeads(
          limit * page,
          limit,
          null,
          nextValue,
          selectedSchool ? selectedSchool : null,
          selectedCompany ? selectedCompany : null
        )(),
      1000
    ),

    [selectedCompany, selectedSchool] // will be created only once initially
  );

  // highlight-ends

  const handleChange = (event) => {
    const nextValue = event;

    setSearchQuery(nextValue);

    // Even though handleChange is created on each render and executed

    // it references the same debouncedSave that was created initially

    debouncedSave(nextValue);
  };

  return (
    <div className="newpaddingtoplefgt">
      <main className="mainbodypadding">
        <div className="container-fluid">
          <div className="row">
            <div className="breadcumarea">
              <h4>All Leads</h4>
              <div className="breadcum">
                <ul>
                  <li>All Leads</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mainContainer">
            <div class="container">
              <div class="ring"></div>
              <div class="ring"></div>
              <div class="ring"></div>
              <p>Loading...</p>
            </div>
          </div>
        )}
        <>
          <section className="product-category">
            <div className="container-fluid p-0">
              <div className="row">
                <div className="col-lg-6">
                  <div className="dashboard-box dashboard-summary">
                    <div className="">
                      <h4 className="blue-1 font6updateadmin m-0">Lead List</h4>
                      <div
                        className="d-flex align-items-center justify-content-between mt-5"
                        style={{ gap: 10 }}
                      >
                        {role == "ADMIN" && (
                          <>
                            <CustomButton
                              btntype="button"
                              ClickEvent={() => {
                                setFilterSelected("all");
                                handleFilter("all");
                              }}
                              noIcon
                              changeClass={
                                filterSelected == "all"
                                  ? "activeleadbtn"
                                  : "noactiveclass"
                              }
                              btnStyle={filterSelected == "all"}
                              btnName={`Show all`}
                              isBtn
                              small={true}
                            />
                            <CustomButton
                              btntype="button"
                              ClickEvent={() => {
                                setFilterSelected("assigned");
                                handleFilter("assigned");
                              }}
                              noIcon
                              changeClass={
                                filterSelected == "assigned"
                                  ? "activeleadbtn"
                                  : "noactiveclass"
                              }
                              btnName="Show assigned"
                              isBtn
                              small={true}
                            />
                            <CustomButton
                              btntype="button"
                              ClickEvent={() => {
                                setFilterSelected("un-assigned");
                                handleFilter("un-assigned");
                              }}
                              noIcon
                              changeClass={
                                filterSelected == "un-assigned"
                                  ? "activeleadbtn"
                                  : "noactiveclass"
                              }
                              btnName="Show un-assigned"
                              isBtn
                              small={true}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="dashboard-box dashboard-summary">
                    <h4 className="blue-1 font6updateadmin m-0">Allot leads</h4>
                    {role == "ADMIN" && (
                      <>
                        <div className="">
                          <div className="d-flex align-items-center justify-content-between mt-5">
                            <CustomButton
                              btntype="button"
                              ClickEvent={() => {
                                setFilterSelected("allotManually");
                                setSelectUsersModal(true);
                              }}
                              noIcon
                              changeClass={
                                filterSelected == "allotManually"
                                  ? "activeleadbtn1"
                                  : "noactiveclass1"
                              }
                              btnName="Select Users to allot leads to"
                              isBtn
                              small={true}
                            />
                            <CustomButton
                              btntype="button"
                              ClickEvent={() => {
                                setFilterSelected("allot");
                                handleAllotAllLeads();
                              }}
                              noIcon
                              changeClass={
                                filterSelected == "allot"
                                  ? "activeleadbtn1"
                                  : "noactiveclass1"
                              }
                              btnName="Allot Leads automatically"
                              isBtn
                              small={true}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-12">
                  {/* <div className="d-flex align-items-center justify-content-between">
                                    <h4 className="blue-1 m-0">Lead List</h4>
                                    <div className="d-flex align-items-center justify-content-between">
                                        {
                                            role == "ADMIN" && <>
                                                <CustomButton btntype="button" ClickEvent={() => { setFilterSelected("all"); handleFilter("all") }} noIcon changeClass="me-4 btn btn-1 " btnStyle={filterSelected == "all" ? { backgroundColor: "#D68392", color: "white" } : { backgroundColor: "white", color: "black" }} btnName={`Show all`} isBtn small={true} />
                                                <CustomButton btntype="button" ClickEvent={() => { setFilterSelected("assigned"); handleFilter("assigned") }} noIcon changeClass="me-4 btn btn-1 " btnStyle={filterSelected == "assigned" ? { backgroundColor: "#D68392", color: "white" } : { backgroundColor: "white", color: "black" }} btnName="Show assigned" isBtn small={true} />
                                                <CustomButton btntype="button" ClickEvent={() => { setFilterSelected("un-assigned"); handleFilter("un-assigned") }} noIcon changeClass="me-4 btn btn-1 " btnStyle={filterSelected == "un-assigned" ? { backgroundColor: "#D68392", color: "white" } : { backgroundColor: "white", color: "black" }} btnName="Show un-assigned" isBtn small={true} />
                                            </>
                                        }

                                    </div>
                                </div> */}
                  {/* <hr /> */}

                  <div className="dashboard-summary dashboard-box">
                    <h4 className="blue-1 font6updateadmin m-0">
                      Search and filters
                    </h4>
                    <div className="row padding_search_icon mt-4">
                      <div className="col-4">
                        <div className="position-relative">
                          {/* <label>Search</label> */}
                          <TextField
                            id="outlined-basic"
                            label="Search"
                            placeholder="Search leads..."
                            value={searchQuery}
                            ref={textInputRef}
                            className="form-control paddingserach"
                            onChange={(e) => handleChange(e.target.value)}
                          />
                          <i className="fa fa-search iconclassmain"></i>
                        </div>
                      </div>
                      {/* <div className="col-3">
                        <TextField
                          label="Created On"
                          placeholder="Search leads..."
                          value={moment(updateDate).format("YYYY-MM-DD")}
                          type="date"
                          className="form-control"
                          onChange={(e) => setUpdateDate(e.target.value)}
                        />
                      </div> */}
                      <div className="col-4">
                        {/* <label>Schools</label> */}
                        {/* // skipValue, limitValue, filterCondition, searchQueryValue, school, company */}
                        <Box sx={{ minWidth: 120 }}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              School
                            </InputLabel>
                            <MuiSelect
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={selectedSchool}
                              label="School"
                              //   onChange={handleChange1}

                              onChange={(e) => {
                                e.target.value == ""
                                  ? handleGetLeads(
                                      limit * page,
                                      limit,
                                      null,
                                      searchQuery != "" ? searchQuery : null,
                                      null,
                                      selectedCompany ?? null
                                    )
                                  : handleGetLeads(
                                      limit * page,
                                      limit,
                                      null,
                                      searchQuery != "" ? searchQuery : null,
                                      e.target.value,
                                      selectedCompany ?? null
                                    );
                                setSelectedSchool(e.target.value);
                              }}
                            >
                              {schoolOptions.map((el) => (
                                <MenuItem value={el.value}>{el.label}</MenuItem>
                              ))}
                            </MuiSelect>
                          </FormControl>
                        </Box>
                      </div>
                      <div className="col-4">
                        <Box sx={{ minWidth: 120 }}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Companies
                            </InputLabel>
                            <MuiSelect
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={selectedCompany}
                              label="Companies"
                              //   onChange={handleChange1}

                              onChange={(e) => {
                                handleGetLeads(
                                  limit * page,
                                  limit,
                                  null,
                                  searchQuery != "" ? searchQuery : null,
                                  selectedSchool ? selectedSchool : null,
                                  e.target.value
                                );
                                setSelectedCompany(e.target.value);
                              }}
                            >
                              {companyoptions.map((el) => (
                                <MenuItem value={el.value}>{el.label}</MenuItem>
                              ))}
                            </MuiSelect>
                          </FormControl>
                        </Box>
                      </div>
                    </div>
                  </div>

                  {/* <div className="d-flex align-items-center justify-content-between">
                    <h4 className="blue-1 m-0">Search and filters</h4>
                    <div className="col-7">
                      <div className="row  d-flex align-items-center justify-content-between">
                        <div className="col-4">
                          <label>Search</label>
                          <input
                            value={searchQuery}
                            ref={textInputRef}
                            className="form-control"
                            placeholder="Search leads ... "
                            onChange={(e) => handleChange(e.target.value)}
                          />
                        </div>
                        <div className="col-4">
                          <label>Schools</label>
                          <ReactSelect
                            value={selectedSchool}
                            onChange={(e) => {
                              e.value == ""
                                ? handleGetLeads(
                                    limit * page,
                                    limit,
                                    null,
                                    searchQuery != "" ? searchQuery : null,
                                    null
                                  )
                                : handleGetLeads(
                                    limit * page,
                                    limit,
                                    null,
                                    searchQuery != "" ? searchQuery : null,
                                    e.value
                                  );
                              setSelectedSchool(e);
                            }}
                            options={[
                              { label: "UnSelect", value: "" },
                              {
                                label: "IITs",
                                value: "IIT,indian institute of technology",
                              },
                              { label: "BITS", value: "BITS, birla institue" },
                              {
                                label: "IIM A",
                                value:
                                  "IIM A, indian institue of management ahemdabad",
                              },
                              {
                                label: "IIM B",
                                value:
                                  "IIM B , indian institue of management bengalore",
                              },
                              {
                                label: "IIM C",
                                value:
                                  "IIM C, indian institue of management Calcutta",
                              },
                              {
                                label: "SRCC",
                                value: "SRCC , Shri Ram College of Commerce",
                              },
                              { label: "LSR", value: "LSR, Lady Shri Ram" },
                            ]}
                          />
                        </div>
                        <div className="col-4">
                          <label>Companies</label>
                          <ReactSelect
                            value={selectedCompany}
                            onChange={(e) => {
                              handleGetLeads(
                                limit * page,
                                limit,
                                null,
                                searchQuery != "" ? searchQuery : null,
                                selectedSchool ? selectedSchool : null,
                                e.value
                              );
                              setSelectedCompany(e);
                            }}
                            options={[
                              { label: "Stealth", value: "Stealth" },
                              {
                                label: "Stealth Startup",
                                value: "Stealth Startup",
                              },
                              {
                                label: "Stealth Company",
                                value: "Stealth Company",
                              },
                              { label: "Mckinsey", value: "Mckinsey" },
                              { label: "BCG", value: "BCG" },
                              { label: "Bain", value: "Bain" },
                              { label: "Flipkart", value: "Flipkart" },
                              { label: "Freshworks", value: "Freshworks" },
                              { label: "Zoho", value: "Zoho" },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* <hr /> */}

                  <DashboardTable>
                    <DataTable
                      columns={category_columns}
                      data={leadsArr}
                      // customStyles={customStyles}
                      progressPending={loading}
                      pagination
                      paginationServer
                      paginationTotalRows={totalElements}
                      onChangeRowsPerPage={handlePerRowsChange}
                      onChangePage={handlePageChange}
                    />
                  </DashboardTable>
                </div>
              </div>
            </div>
          </section>

          <Modal
            open={ModalBox}
            onClose={() => setModalBox(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="modal-box">
              <div
                className="modal-container"
                style={{ minWidth: "70vw", maxWidth: "100vw" }}
              >
                <div className="modal-header">
                  <h4>Select sub user to assign to</h4>
                  <CustomButton
                    isBtn
                    btntype="button"
                    iconName="ion-close-circled text-white"
                    changeClass="border-0 bg-transparent rounded-circle modal-close"
                    ClickEvent={(e) => {
                      e.preventDefault();
                      setModalBox(false);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <Select
                    onChange={handleChangeValue}
                    options={
                      userArr && userArr?.length > 0
                        ? userArr.map((el) => ({
                            label: `${el.name}`,
                            value: el._id,
                            ...el,
                          }))
                        : []
                    }
                  />

                  <CustomButton
                    isBtn
                    btnName="Assign Lead"
                    btntype="button"
                    changeClass="mt-4 btn btn-1"
                    ClickEvent={(e) => {
                      e.preventDefault();
                      handleAssignLeadToUser();
                      setModalBox(false);
                    }}
                  />
                </div>
              </div>
            </Box>
          </Modal>

          <Modal
            open={selectUsersModal}
            onClose={() => setSelectUsersModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="modal-box">
              <div
                className="modal-container"
                style={{ minWidth: "70vw", maxWidth: "100vw" }}
              >
                <div className="modal-header">
                  <h4>
                    Select one or more sub user to automatically divide leads to
                    them
                  </h4>
                  <CustomButton
                    isBtn
                    btntype="button"
                    iconName="ion-close-circled text-white"
                    changeClass="border-0 bg-transparent rounded-circle modal-close"
                    ClickEvent={(e) => {
                      e.preventDefault();
                      setSelectUsersModal(false);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <Select
                    onChange={(e) => {
                      setSelectedUsers(e);
                    }}
                    value={selectedUsers}
                    isMulti
                    closeMenuOnSelect={false}
                    options={
                      userArr && userArr?.length > 0
                        ? userArr.map((el) => ({
                            label: `${el.name}`,
                            value: el._id,
                            ...el,
                          }))
                        : []
                    }
                  />

                  <CustomButton
                    isBtn
                    btnName="Assign Leads to selected users"
                    btntype="button"
                    changeClass="mt-4 btn btn-1"
                    ClickEvent={(e) => {
                      e.preventDefault();
                      handleAssignLeadToSelectedUsers();
                      setSelectUsersModal(false);
                    }}
                  />
                </div>
              </div>
            </Box>
          </Modal>

          <Modal
            open={leadDetailsModal}
            onClose={() => setLeadDetailsModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="modal-box">
              <div
                className="modal-container"
                style={{ minWidth: "70vw", maxWidth: "100vw" }}
              >
                <div className="modal-header">
                  <h5>Lead Detail</h5>
                  <CustomButton
                    isBtn
                    btntype="button"
                    iconName="ion-close-circled text-white"
                    changeClass="border-0 bg-transparent rounded-circle modal-close"
                    ClickEvent={(e) => {
                      e.preventDefault();
                      setLeadDetailsModal(false);
                    }}
                  />
                </div>

                <div
                  className="modal-body"
                  style={{
                    overflowY: "auto",
                    maxHeight: "70vh",
                    minHeight: "70vh",
                    minWidth: "80vw",
                    maxWidth: "80vw",
                  }}
                >
                  {/* <CustomButton
                                isBtn
                                btntype="button"
                                btnName={"View Lead Details"}
                                btnStyle={leadDetailsVisible == 0 ? { backgroundColor: "#D68392", color: "white", border: "solid 1px white" } : { backgroundColor: "white", color: "black", border: "solid 1px black" }}
                                ClickEvent={(e) => {
                                    e.preventDefault();
                                    setLeadDetailsVisible(0);
                                }}
                            /> */}
                  <CustomButton
                    isBtn
                    btntype="button"
                    btnName={"View Lead Comments"}
                    changeClass="ms-3 btn btn-1 "
                    btnStyle={
                      leadDetailsVisible == 1
                        ? {
                            backgroundColor: "#D68392",
                            color: "white",
                            border: "solid 1px white",
                          }
                        : {
                            backgroundColor: "white",
                            color: "black",
                            border: "solid 1px black",
                          }
                    }
                    ClickEvent={(e) => {
                      e.preventDefault();
                      setLeadDetailsVisible(1);
                      commentsContainer.current?.scrollIntoView({
                        block: "end",
                        inline: "nearest",
                      });
                    }}
                  />
                  <CustomButton
                    isBtn
                    btntype="button"
                    btnName={"View Lead History"}
                    changeClass="ms-3 btn btn-1 "
                    btnStyle={
                      leadDetailsVisible == 2
                        ? {
                            backgroundColor: "#D68392",
                            color: "white",
                            border: "solid 1px white",
                          }
                        : {
                            backgroundColor: "white",
                            color: "black",
                            border: "solid 1px black",
                          }
                    }
                    ClickEvent={(e) => {
                      e.preventDefault();
                      setLeadDetailsVisible(2);
                    }}
                  />
                  {
                    // leadDetailsVisible == 0 ?
                    //     <div>

                    //         <h4 className='mt-5'>Campaign Details</h4>
                    //         <table class="table">
                    //             <thead>
                    //                 <tr>
                    //                     <th scope="col">Name</th>
                    //                     <th scope="col">Query</th>
                    //                     <th scope="col">Company</th>
                    //                     <th scope="col">School</th>
                    //                 </tr>
                    //             </thead>
                    //             <tbody>
                    //                 <tr>
                    //                     <td>{selectedLead?.campaignObj?.name}</td>
                    //                     <td>{selectedLead?.campaignObj?.searchQuery}</td>
                    //                     <td>{selectedLead?.campaignObj?.company}</td>
                    //                     <td>{selectedLead?.campaignObj?.school}</td>
                    //                 </tr>
                    //             </tbody>
                    //         </table>

                    //         <h4 className='mt-5'>Client Details</h4>
                    //         <table class="table">
                    //             <thead>
                    //                 <tr>
                    //                     <th scope="col">Name</th>
                    //                     <th scope="col">Location</th>
                    //                     <th scope="col">Current Position</th>
                    //                     <th scope="col">Profile Url</th>
                    //                 </tr>
                    //             </thead>
                    //             <tbody>
                    //                 <tr>
                    //                     <td>{selectedLead?.clientObj?.name}</td>
                    //                     <td>{selectedLead?.clientObj?.location}</td>
                    //                     <td>{selectedLead?.clientObj?.currentPosition}</td>
                    //                     <td><a href={selectedLead?.clientObj?.link}>Click to view Url</a></td>
                    //                 </tr>
                    //             </tbody>
                    //         </table>

                    //         <h4 className='mt-5'>Client Education</h4>
                    //         <table class="table">
                    //             <thead>
                    //                 <tr>
                    //                     <th scope="col">School Name</th>
                    //                     <th scope="col">School Details</th>
                    //                     <th scope="col">Year</th>
                    //                 </tr>
                    //             </thead>
                    //             <tbody>
                    //                 {
                    //                     selectedLead?.clientObj?.educationArr && selectedLead?.clientObj?.educationArr.length > 0 && selectedLead?.clientObj?.educationArr.map((el, index) => {
                    //                         return (
                    //                             <tr key={index}>
                    //                                 <td>{el.schoolName ? el.schoolName : "N.A."}</td>
                    //                                 <td>{el?.schoolDetail ? el?.schoolDetail : "N.A."}</td>
                    //                                 <td>{el?.year ? el?.year : "N.A."}</td>
                    //                             </tr>

                    //                         )
                    //                     })
                    //                 }
                    //             </tbody>
                    //         </table>

                    //         <h4 className='mt-5'>Client Experience</h4>
                    //         <table class="table">
                    //             <thead>
                    //                 <tr>
                    //                     <th scope="col">Company Name</th>
                    //                     <th scope="col">Company Details</th>
                    //                     <th scope="col">Year</th>
                    //                 </tr>
                    //             </thead>
                    //             <tbody>
                    //                 {
                    //                     selectedLead?.clientObj?.experienceArr && selectedLead?.clientObj?.experienceArr.length > 0 && selectedLead?.clientObj?.experienceArr.map((el, index) => {
                    //                         return (
                    //                             <tr key={index}>
                    //                                 <td>{el.company ? el.company : "N.A."}</td>
                    //                                 <td>{el?.companyDetail ? el?.companyDetail : "N.A."}</td>
                    //                                 <td>{el?.year ? el?.year : "N.A."}</td>
                    //                             </tr>

                    //                         )
                    //                     })
                    //                 }
                    //             </tbody>
                    //         </table>

                    //         <h4 className='mt-5'>Contact Details</h4>
                    //         <table class="table">
                    //             <thead>
                    //                 <tr>
                    //                     <th scope="col">Heading</th>
                    //                     <th scope="col">Values</th>
                    //                 </tr>
                    //             </thead>
                    //             <tbody>
                    //                 {
                    //                     selectedLead?.clientObj?.contactInfoArr && selectedLead?.clientObj?.contactInfoArr.length > 0 && selectedLead?.clientObj?.contactInfoArr.map((el, index) => {
                    //                         return (
                    //                             <tr key={index}>
                    //                                 <td>{el.heading ? el.heading : "N.A."}</td>
                    //                                 <td>{el?.dataArr && el.dataArr?.length > 0 ? el?.dataArr.map((ele, index) => {
                    //                                     return (
                    //                                         <p key={index}>{ele}</p>
                    //                                     )
                    //                                 }) : "N.A."}</td>
                    //                             </tr>

                    //                         )
                    //                     })
                    //                 }
                    //             </tbody>
                    //         </table>

                    //     </div>
                    //     :
                    leadDetailsVisible == 1 ? (
                      <div>
                        <div className="row d-flex justify-content-between align-items-center mb-3">
                          <h4 className="mt-4 col-11">Lead Comments</h4>
                          {/* <h4 className='mt-5 col-1'>Reload</h4> */}
                          <CustomButton
                            isBtn
                            btntype="button"
                            btnName={"Reload"}
                            extraClass={`mt-4 col-1`}
                            // changeClass="ms-3 btn"
                            // btnStyle={leadDetailsVisible == 2 ? { backgroundColor: "#D68392", color: "white", border: "solid 1px white" } : { backgroundColor: "white", color: "black", border: "solid 1px black" }}
                            ClickEvent={(e) => {
                              e.preventDefault();
                              handlegetComment();
                            }}
                          />
                        </div>
                        <div
                          style={{
                            border: "solid 1px black",
                            padding: 15,
                            borderRadius: 15,
                            minHeight: "40vh",
                            maxHeight: "40vh",
                            overflowY: "auto",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {leadCommentsArr &&
                            leadCommentsArr?.length > 0 &&
                            leadCommentsArr.map((el, index) => {
                              return (
                                <div
                                  style={{
                                    border: "solid 1px black",
                                    borderRadius: 10,
                                    width: "98%",
                                    padding: 10,
                                    margin: "10px 0px",
                                  }}
                                  key={index}
                                >
                                  <div>{el.message}</div>
                                  <div className="row d-flex justify-content-between mt-3">
                                    <div
                                      className="col-11"
                                      style={{ fontSize: 12, color: "grey" }}
                                    >
                                      by{" "}
                                      {el?.userObj?.role == "ADMIN"
                                        ? "ADMIN"
                                        : el?.userObj?.name}
                                    </div>
                                    <div
                                      className="col-1 d-flex justify-content-end"
                                      style={{ fontSize: 12, color: "grey" }}
                                    >
                                      {DisplayDate(el?.createdAt, "dd/mm/yyyy")}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          <div
                            ref={commentsContainer}
                            style={{ marginTop: 170 }}
                          />
                        </div>
                        <div className="mt-4">
                          <div className="row d-flex align-items-center">
                            <div className="col-11">
                              <textarea
                                className="form-control"
                                onChange={(e) => setLeadComment(e.target.value)}
                                value={leadComment}
                                name="name"
                                type="text"
                              />
                            </div>
                            <div className="col-1">
                              <CustomButton
                                isBtn
                                btntype="button"
                                btnName={"Add"}
                                // changeClass="ms-3 btn"
                                // btnStyle={leadDetailsVisible == 2 ? { backgroundColor: "#D68392", color: "white", border: "solid 1px white" } : { backgroundColor: "white", color: "black", border: "solid 1px black" }}
                                ClickEvent={(e) => {
                                  e.preventDefault();
                                  handleAddComment();
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="mt-5">Lead History</h4>
                        <table class="table">
                          <thead>
                            <tr>
                              <th scope="col">Previous Value</th>
                              <th scope="col">Value</th>
                              <th scope="col">Message</th>
                              <th scope="col">Done On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leadHistoryArr && leadHistoryArr?.length > 0 ? (
                              leadHistoryArr.map((el, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      {el?.previousValue
                                        ? el?.previousValue
                                        : "N.A."}
                                    </td>
                                    <td>{el.value ? el.value : "N.A."}</td>
                                    <td>
                                      {el?.message ? el?.message : "N.A."}
                                    </td>
                                    <td>
                                      {el?.createdAt
                                        ? `${new Date(
                                            el?.createdAt
                                          ).toDateString()} at ${new Date(
                                            el.createdAt
                                          ).getHours()}:${new Date(
                                            el.createdAt
                                          ).getMinutes()}`
                                        : "N.A."}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={3}>
                                  No history found for this lead
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )
                  }
                </div>
              </div>
            </Box>
          </Modal>
        </>
      </main>
    </div>
  );
}
