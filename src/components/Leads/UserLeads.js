import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { assignLeadToUser, changeLeadRating, changeLeadStatus, getLeads } from '../../services/Lead.service';
import { getUser } from '../../services/users.service';
import { toastSuccess } from '../../utils/toastUtils';
import ActionIcon from '../Utility/ActionIcon';
import CustomButton from '../Utility/Button';
import { DashboardTable } from '../Utility/DashboardBox';
import { toastError } from '../Utility/ToastUtils';
import { Modal, Box } from "@mui/material";
import Select from 'react-select';
import { useSelector } from "react-redux";
import { leadStatusObj } from '../../utils/LeadStatus';
import ReactStars from "react-rating-stars-component";
import { getLeadLogs } from '../../services/leadLogs.service';
import { addLeadComment, getLeadComments } from '../../services/LeadComments.service';
import { DisplayDate } from '../../utils/DateUtils';
import { getLeadStatus } from '../../services/LeadStatus.service';
import { useNavigate } from 'react-router-dom';
export default function UserLeads() {
    let role = useSelector((state) => state.auth.role);
    const commentsContainer = useRef()
    let userObj = useSelector((state) => state.auth.user);
    const [selectedLead, setSelectedLead] = useState({});
    const [leadHistoryArr, setLeadHistoryArr] = useState([]);
    const [leadDetailsModal, setLeadDetailsModal] = useState(false);
    const [leadDetailsVisible, setLeadDetailsVisible] = useState(0);
    const [leadsArr, setLeadsArr] = useState([]);
    const [leadsMainArr, setLeadsMainArr] = useState([]);
    const [leadComment, setLeadComment] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const [leadsStatusArr, setLeadsStatusArr] = useState([]);



    const [leadCommentsArr, setLeadCommentsArr] = useState([]);
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



    const handleGetLeads = async (skipValue, limitValue) => {
        try {
            let { data: res } = await getLeads(`role=${role}&userId=${userObj?._id}&skip=${skipValue}&limit=${limitValue}`)
            if (res.data) {
                console.log(res.data)
                setTotalElements(res.totalLeads)
                setLeadsArr(res.data)
                setLeadsMainArr(res.data)
            }
        }
        catch (err) {
            toastError(err)
        }
    }


    const handleStatusChange = async (value, originalObj) => {
        try {
            let obj = {
                status: value
            }
            let { data: res } = await changeLeadStatus(originalObj._id, obj)
            if (res.message) {
                toastSuccess(res.message)
                handleGetLeads(limit * page, limit)
            }
        }
        catch (err) {
            toastError(err)
        }
    }


    const handleGetLeadHistory = async () => {
        try {

            let { data: res } = await getLeadLogs(selectedLead._id)
            if (res.data) {
                setLeadHistoryArr(res.data)
            }
        }
        catch (err) {
            toastError(err)
        }
    }
    const handleAddComment = async () => {
        try {
            let obj = {
                message: leadComment,
                leadId: selectedLead._id
            }
            let { data: res } = await addLeadComment(obj)
            if (res.message) {
                toastSuccess(res.message)
                handlegetComment()
            }
        }
        catch (err) {
            toastError(err)
        }
    }
    const handleRedirect = (id) => {
        navigate(`/User-details/${id}`);
    };


    const handlegetComment = async () => {
        try {
            let { data: res } = await getLeadComments(selectedLead._id)
            if (res.data) {
                setLeadCommentsArr(res.data)
                commentsContainer.current?.scrollIntoView({ block: "end", inline: "nearest" })
            }
        }
        catch (err) {
            toastError(err)
        }
    }


    useEffect(() => {
        if (selectedLead && selectedLead != "" && selectedLead._id) {
            handleGetLeadHistory()
            handlegetComment()
        }
    }, [selectedLead])


    const category_columns = [
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
                <div style={{ flex: "flex", flexWrap: "wrap" }}>{`${row?.clientObj?.experienceArr?.length > 0
                    ? `${row?.clientObj?.experienceArr[0]?.companyDetail} | ${row?.clientObj?.experienceArr[0]?.company}`
                    : "NA"
                    }`}</div>
            ),
            width: "14%",
        },
        {
            name: "Previous Company",
            cell: (row) => (
                <div style={{ flex: "flex", flexWrap: "wrap" }}>{`${row?.clientObj?.experienceArr?.length > 1
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
        // {
        //     name: "Last Updated On",
        //     selector: (row) => `${new Date(row?.createdAt).toDateString()}`,
        //     width: "12%"
        // },
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

    ];





    useEffect(() => {
        handleGetLeads(limit * page, limit)
    }, [])

    useEffect(() => {
        if (commentsContainer.current) {
            commentsContainer.current?.scrollIntoView({ block: "end", inline: "nearest" })
        }
    }, [commentsContainer.current])

    const handlePageChange = (page) => {
        if (totalElements / page > 1) {
            handleGetLeads(limit * (page - 1), limit)
            setPage((page - 1))
        }

    }

    const handlePerRowsChange = (newPerPage, page) => {
        handleGetLeads(newPerPage * (page - 1), newPerPage)
        setLimit(newPerPage)
        console.log(newPerPage, page, "newPerPage, page")
    }




    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                color: "#757474"
            },
        },
    };


    return (
        <main>
            <section className="product-category">
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-12 col-md-12">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h4 className="blue-1 m-0">Lead List</h4>
                            </div>
                            <DashboardTable>
                                <DataTable
                                    columns={category_columns}
                                    data={leadsArr && leadsArr.length > 0 ? leadsArr : []}
                                    pagination
                                    paginationServer
                                    customStyles={customStyles}
                                    paginationTotalRows={totalElements}
                                    onChangeRowsPerPage={handlePerRowsChange}
                                    onChangePage={handlePageChange}
                                />
                            </DashboardTable>
                        </div>
                    </div>
                </div>
            </section>

            {/* <Modal open={leadDetailsModal} onClose={() => setLeadDetailsModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box className="modal-box">
                    <div className="modal-container" style={{ minWidth: "70vw", maxWidth: "100vw" }}>
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
                        <div className="modal-body" style={{ overflowY: "auto", maxHeight: "70vh" }}>
                            <h4 className='mt-5'>Campaign Details</h4>
                            <CustomButton
                                isBtn
                                btntype="button"
                                btnName={"hello"}
                            />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Query</th>
                                        <th scope="col">Company</th>
                                        <th scope="col">School</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selectedLead?.campaignObj?.name}</td>
                                        <td>{selectedLead?.campaignObj?.searchQuery}</td>
                                        <td>{selectedLead?.campaignObj?.company}</td>
                                        <td>{selectedLead?.campaignObj?.school}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h4 className='mt-5'>Client Details</h4>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Current Position</th>
                                        <th scope="col">Profile Url</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selectedLead?.clientObj?.name}</td>
                                        <td>{selectedLead?.clientObj?.location}</td>
                                        <td>{selectedLead?.clientObj?.currentPosition}</td>
                                        <td><a href={selectedLead?.clientObj?.link}>Click to view Url</a></td>
                                    </tr>
                                </tbody>
                            </table>
                            <h4 className='mt-5'>Client Education</h4>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">School Name</th>
                                        <th scope="col">School Details</th>
                                        <th scope="col">Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedLead?.clientObj?.educationArr && selectedLead?.clientObj?.educationArr.length > 0 ? selectedLead?.clientObj?.educationArr.map((el, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{el.schoolName ? el.schoolName : "N.A."}</td>
                                                    <td>{el?.schoolDetail ? el?.schoolDetail : "N.A."}</td>
                                                    <td>{el?.year ? el?.year : "N.A."}</td>
                                                </tr>
                                            )
                                        })
                                            :
                                            <tr>
                                                <td>N.A.</td>
                                                <td>N.A.</td>
                                                <td>N.A.</td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                            <h4 className='mt-5'>Client Experience</h4>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Company Name</th>
                                        <th scope="col">Company Details</th>
                                        <th scope="col">Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedLead?.clientObj?.experienceArr && selectedLead?.clientObj?.experienceArr.length > 0 ? selectedLead?.clientObj?.experienceArr.map((el, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{el.company ? el.company : "N.A."}</td>
                                                    <td>{el?.companyDetail ? el?.companyDetail : "N.A."}</td>
                                                    <td>{el?.year ? el?.year : "N.A."}</td>
                                                </tr>
                                            )
                                        })
                                            :
                                            <tr>
                                                <td>N.A.</td>
                                                <td>N.A.</td>
                                                <td>N.A.</td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Box>
            </Modal> */}
            <Modal open={leadDetailsModal} onClose={() => setLeadDetailsModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box className="modal-box">
                    <div className="modal-container" style={{ minWidth: "70vw", maxWidth: "100vw" }}>
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
                        <div className="modal-body" style={{ overflowY: "auto", maxHeight: "70vh", minHeight: "70vh", minWidth: "80vw", maxWidth: "80vw" }}>
                            <CustomButton
                                isBtn
                                btntype="button"
                                btnName={"View Lead Details"}
                                btnStyle={leadDetailsVisible == 0 ? { backgroundColor: "black", color: "white", border: "solid 1px white" } : { backgroundColor: "white", color: "black", border: "solid 1px black" }}
                                ClickEvent={(e) => {
                                    e.preventDefault();
                                    setLeadDetailsVisible(0);
                                }}
                            />
                            <CustomButton
                                isBtn
                                btntype="button"
                                btnName={"View Lead Comments"}
                                changeClass="ms-3 btn btn-1 "

                                btnStyle={leadDetailsVisible == 1 ? { backgroundColor: "black", color: "white", border: "solid 1px white" } : { backgroundColor: "white", color: "black", border: "solid 1px black" }}
                                ClickEvent={(e) => {
                                    e.preventDefault();
                                    setLeadDetailsVisible(1);
                                    commentsContainer.current?.scrollIntoView({ block: "end", inline: "nearest" })
                                }}
                            />
                            <CustomButton
                                isBtn
                                btntype="button"
                                btnName={"View Lead History"}
                                changeClass="ms-3 btn btn-1 "
                                btnStyle={leadDetailsVisible == 2 ? { backgroundColor: "black", color: "white", border: "solid 1px white" } : { backgroundColor: "white", color: "black", border: "solid 1px black" }}
                                ClickEvent={(e) => {
                                    e.preventDefault();
                                    setLeadDetailsVisible(2);
                                }}
                            />
                            {
                                leadDetailsVisible == 0 ?
                                    <div>

                                        <h4 className='mt-5'>Campaign Details</h4>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Query</th>
                                                    <th scope="col">Company</th>
                                                    <th scope="col">School</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{selectedLead?.campaignObj?.name}</td>
                                                    <td>{selectedLead?.campaignObj?.searchQuery}</td>
                                                    <td>{selectedLead?.campaignObj?.company}</td>
                                                    <td>{selectedLead?.campaignObj?.school}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <h4 className='mt-5'>Client Details</h4>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Location</th>
                                                    <th scope="col">Current Position</th>
                                                    <th scope="col">Profile Url</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{selectedLead?.clientObj?.name}</td>
                                                    <td>{selectedLead?.clientObj?.location}</td>
                                                    <td>{selectedLead?.clientObj?.currentPosition}</td>
                                                    <td><a href={selectedLead?.clientObj?.link}>Click to view Url</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <h4 className='mt-5'>Client Education</h4>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">School Name</th>
                                                    <th scope="col">School Details</th>
                                                    <th scope="col">Year</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    selectedLead?.clientObj?.educationArr && selectedLead?.clientObj?.educationArr.length > 0 ? selectedLead?.clientObj?.educationArr.map((el, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{el.schoolName ? el.schoolName : "N.A."}</td>
                                                                <td>{el?.schoolDetail ? el?.schoolDetail : "N.A."}</td>
                                                                <td>{el?.year ? el?.year : "N.A."}</td>
                                                            </tr>
                                                        )
                                                    })
                                                        :
                                                        <tr>
                                                            <td>N.A.</td>
                                                            <td>N.A.</td>
                                                            <td>N.A.</td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </table>
                                        <h4 className='mt-5'>Client Experience</h4>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Company Name</th>
                                                    <th scope="col">Company Details</th>
                                                    <th scope="col">Year</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    selectedLead?.clientObj?.experienceArr && selectedLead?.clientObj?.experienceArr.length > 0 ? selectedLead?.clientObj?.experienceArr.map((el, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{el.company ? el.company : "N.A."}</td>
                                                                <td>{el?.companyDetail ? el?.companyDetail : "N.A."}</td>
                                                                <td>{el?.year ? el?.year : "N.A."}</td>
                                                            </tr>
                                                        )
                                                    })
                                                        :
                                                        <tr>
                                                            <td>N.A.</td>
                                                            <td>N.A.</td>
                                                            <td>N.A.</td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    :
                                    leadDetailsVisible == 1 ?
                                        <div>
                                            <div className="row d-flex justify-content-between align-items-center mb-3">
                                                <h4 className='mt-4 col-11'>Lead Comments</h4>
                                                {/* <h4 className='mt-5 col-1'>Reload</h4> */}
                                                <CustomButton
                                                    isBtn
                                                    btntype="button"
                                                    btnName={"Reload"}
                                                    extraClass={`mt-4 col-1`}
                                                    // changeClass="ms-3 btn"
                                                    // btnStyle={leadDetailsVisible == 2 ? { backgroundColor: "black", color: "white", border: "solid 1px white" } : { backgroundColor: "white", color: "black", border: "solid 1px black" }}
                                                    ClickEvent={(e) => {
                                                        e.preventDefault();
                                                        handlegetComment();
                                                    }}
                                                />

                                            </div>
                                            <div style={{ border: "solid 1px black", padding: 15, borderRadius: 15, minHeight: "40vh", maxHeight: "40vh", overflowY: "auto", display: "grid", placeItems: "center" }}>
                                                {leadCommentsArr && leadCommentsArr.length > 0 && leadCommentsArr.map((el, index) => {
                                                    return (
                                                        <div style={{ border: "solid 1px black", borderRadius: 10, width: "98%", padding: 10, margin: "10px 0px" }} key={index}>
                                                            <div>
                                                                {el.message}
                                                            </div>
                                                            <div className="row d-flex justify-content-between mt-3">

                                                                <div className='col-11' style={{ fontSize: 12, color: "grey" }}>
                                                                    by {el?.userObj?.role == "ADMIN" ? "ADMIN" : el?.userObj?.name}
                                                                </div>
                                                                <div className='col-1 d-flex justify-content-end' style={{ fontSize: 12, color: "grey" }}>
                                                                    {DisplayDate(el?.createdAt, "dd/mm/yyyy")}
                                                                </div>
                                                            </div>


                                                        </div>
                                                    )
                                                })}
                                                <div ref={commentsContainer} style={{ marginTop: 170 }} />
                                            </div>
                                            <div className="mt-4" >
                                                <div className="row d-flex align-items-center">
                                                    <div className="col-11">
                                                        <textarea className="form-control" onChange={(e) => setLeadComment(e.target.value)} value={leadComment} name="name" type="text" />
                                                    </div>
                                                    <div className="col-1">
                                                        <CustomButton
                                                            isBtn
                                                            btntype="button"
                                                            btnName={"Add"}
                                                            // changeClass="ms-3 btn"
                                                            // btnStyle={leadDetailsVisible == 2 ? { backgroundColor: "black", color: "white", border: "solid 1px white" } : { backgroundColor: "white", color: "black", border: "solid 1px black" }}
                                                            ClickEvent={(e) => {
                                                                e.preventDefault();
                                                                handleAddComment();
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <h4 className='mt-5'>Lead History</h4>
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
                                                    {
                                                        leadHistoryArr && leadHistoryArr.length > 0 ? leadHistoryArr.map((el, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{el?.previousValue ? el?.previousValue : "N.A."}</td>
                                                                    <td>{el.value ? el.value : "N.A."}</td>
                                                                    <td>{el?.message ? el?.message : "N.A."}</td>
                                                                    <td>{el?.createdAt ? `${new Date(el?.createdAt).toDateString()} at ${new Date(el.createdAt).getHours()}:${new Date(el.createdAt).getMinutes()}` : "N.A."}</td>
                                                                </tr>
                                                            )
                                                        })
                                                            :
                                                            <tr>
                                                                <td colSpan={3}>No history found for this lead</td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                            }


                        </div>
                    </div>
                </Box>
            </Modal>
        </main>
    )
}

