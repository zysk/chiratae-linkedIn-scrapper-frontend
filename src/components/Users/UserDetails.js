import { Box, Modal } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { addDealToSavanta } from "../../services/Campaign.service";
import { changeLeadStatus, getLeadById } from '../../services/Lead.service';
import { addLeadComment, getLeadComments } from '../../services/LeadComments.service';
import { getLeadLogs } from '../../services/leadLogs.service';
import { getLeadStatus } from '../../services/LeadStatus.service';
import { DisplayDate } from '../../utils/DateUtils';
import { toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';
import { DashboardTable } from '../Utility/DashboardBox';
import { toastError } from '../Utility/ToastUtils';

export default function UserDetails() {

    const params = useParams()
    const [leadObj, setLeadObj] = useState({});
    const [leadHistoryArr, setLeadHistoryArr] = useState([]);
    const [leadCommentsArr, setLeadCommentsArr] = useState([]);
    const [leadComment, setLeadComment] = useState("");
    const commentsEndRef = useRef()
    const commentsContainerRef = useRef()
    const [leadsStatusArr, setLeadsStatusArr] = useState([]);
    const [previousLeadsArr, setPreviousLeadsArr] = useState([]);
    const [ModalBox, setModalBox] = useState(false);
    const [selectedPreviousLead, setSelectedPreviousLead] = useState({});


    const handleGetLeadStatus = async () => {
        try {

            let { data: res } = await getLeadStatus()
            if (res.data) {
                setLeadsStatusArr(res.data)
            }
        }
        catch (err) {
            toastError(err)
        }
    }


    const handleGetUserDetails = async () => {
        try {
            let { data: res } = await getLeadById(params.id);
            if (res.data) {
                console.log(res.data);
                setLeadObj(res.data);
                console.log(res.data.previousLeadsArr, "previousLeadsArr")
                setPreviousLeadsArr(res.data.previousLeadsArr ? res.data.previousLeadsArr : []);
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    useEffect(() => {
        if (params?.id) {
            handleGetUserDetails();
            handleGetLeadHistory();
            handlegetComment();
            handleGetLeadStatus();
        }
    }, [params.id])





    const handleGetLeadHistory = async () => {
        try {

            let { data: res } = await getLeadLogs(params.id)
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
                leadId: params.id
            }
            let { data: res } = await addLeadComment(obj)
            if (res.message) {
                toastSuccess(res.message)
                setLeadComment("")
                handlegetComment()
            }
        }
        catch (err) {
            toastError(err)
        }
    }


    const handleAddDealToSavanta = async () => {
        try {
            let { data: res } = await addDealToSavanta(params.id)
            if (res.message) {
                toastSuccess(res.message)
            }
        }
        catch (err) {
            toastError(err)
        }
    }



    const handlegetComment = async () => {
        try {
            let { data: res } = await getLeadComments(params.id)
            if (res.data) {
                setLeadCommentsArr(res.data)
                console.log(commentsContainerRef.current.scrollHeight, "commentsContainerRef.current.clientHeight")
                let scrollHeightValue = commentsContainerRef.current.scrollHeight
                commentsContainerRef.current.scrollTop = scrollHeightValue;
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    const handleStatusChange = async (value, id) => {
        try {
            let obj = {
                status: value
            }
            let { data: res } = await changeLeadStatus(id, obj)
            if (res.message) {
                toastSuccess(res.message)
                handleGetLeadHistory()
            }
        }
        catch (err) {
            toastError(err)
        }
    }


    return (
        <main>
            <section>
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-12 col-md-12 userDetailContainer">
                            <DashboardTable>
                                <div className='row'>

                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Founder Name</th>
                                                <th scope="col">Owner</th>
                                                <th scope="col">Rating</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{leadObj?.clientObj?.name}</td>
                                                <td>{leadObj?.clientObj?.currentPosition}</td>
                                                <td>{leadObj?.rating}</td>
                                                <td><Select onChange={(e) => { handleStatusChange(e.value, leadObj._id) }} value={{ label: leadObj?.status, value: leadObj?.status }} options={leadsStatusArr && leadsStatusArr.length > 0 && leadsStatusArr.map(el => ({ label: el.value, value: el.value }))} /></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </DashboardTable>
                            <hr />


                            <div className="row d-flex justify-content-between">

                                <div className="col-6">
                                    <DashboardTable>
                                        <div className='row'>
                                            <div className="col-10 d-flex justify-content-between align-items-center mb-3">
                                                <h4 className='col-12'>Details</h4>
                                            </div>

                                            <div className="col-10 d-flex justify-content-between align-items-center mb-3">
                                                <p className='col-12'><b>Current Position</b> | {leadObj?.clientObj?.currentPosition}</p>
                                            </div>
                                            <div className="col-10 d-flex justify-content-between align-items-center mb-3">
                                                <h4 className='col-12'>Notes</h4>
                                                <CustomButton
                                                    isBtn
                                                    btntype="button"
                                                    btnName={"Reload"}
                                                    noIcon
                                                    ClickEvent={(e) => {
                                                        e.preventDefault();
                                                        handlegetComment();
                                                    }}
                                                />

                                            </div>
                                            <div className='col-12' ref={commentsContainerRef} style={{ border: "solid 1px rgba(0,0,0,0.2)", padding: 15, borderRadius: 15, minHeight: "40vh", maxHeight: "60vh", overflowY: "auto", display: "grid", placeItems: "center" }}>
                                                {leadCommentsArr && leadCommentsArr.length > 0 && leadCommentsArr.map((el, index) => {
                                                    return (
                                                        <div style={{ border: "solid 1px white", borderRadius: 5, width: "95%", backgroundColor: "#D68594", padding: 10, margin: "10px 0px" }} key={index}>
                                                            <div style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
                                                                {el.message}
                                                            </div>
                                                            <div className="row d-flex justify-content-between mt-3">

                                                                <div className='col-11' style={{ fontSize: 12, color: "white" }}>
                                                                    by {el?.userObj?.role == "ADMIN" ? "ADMIN" : el?.userObj?.name}
                                                                </div>
                                                                <div className='col-1 d-flex justify-content-end' style={{ fontSize: 12, color: "white" }}>
                                                                    {DisplayDate(el?.createdAt, "dd/mm/yyyy")}
                                                                </div>
                                                            </div>


                                                        </div>
                                                    )
                                                })}
                                                <div ref={commentsEndRef} style={{ marginTop: 170 }} />
                                            </div>
                                            <div className="col-12" >
                                                <div className="row">
                                                    <div className="col-12 d-flex justify-content-between align-items-center mb-3">
                                                        <textarea className="form-control me-5" onChange={(e) => setLeadComment(e.target.value)} value={leadComment} name="name" type="text" />
                                                        <CustomButton
                                                            isBtn
                                                            btntype="button"
                                                            btnName={"Add"}
                                                            noIcon
                                                            ClickEvent={(e) => {
                                                                e.preventDefault();
                                                                handleAddComment();
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </DashboardTable>
                                </div>

                                <div className="col-6 educationContainer">
                                    <DashboardTable>

                                        <div className='row'>
                                            <div style={{ maxHeight: "85vh", overflowY: "auto" }}>
                                                <h4 className='pt-2'>Education</h4>
                                                <table class="table">
                                                    <thead className='m-0 p-0'>
                                                        <tr className='m-0 p-0'>
                                                            <th className='m-0 p-0' scope="col">School Name</th>
                                                            <th className='m-0 p-0' scope="col">School Details</th>
                                                            <th className='m-0 p-0' scope="col">Year</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='m-0 p-0'>
                                                        {
                                                            leadObj?.clientObj?.educationArr && leadObj?.clientObj?.educationArr.length > 0 && leadObj?.clientObj?.educationArr.map((el, index) => {
                                                                return (
                                                                    <tr className='m-0 p-0' key={index}>
                                                                        <td className='m-0 ps-0'>{el.schoolName ? el.schoolName : "N.A."}</td>
                                                                        <td className='m-0 ps-0'>{el?.schoolDetail ? el?.schoolDetail : "N.A."}</td>
                                                                        <td className='m-0 ps-0'>{el?.year ? el?.year : "N.A."}</td>
                                                                    </tr>

                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                                <h4 className='mt-5'>Experience</h4>
                                                <table class="table">
                                                    <thead>
                                                        <tr className='m-0 p-0'>
                                                            <th className='m-0 p-0' scope="col">Company Name</th>
                                                            <th className='m-0 p-0' scope="col">Company Details</th>
                                                            <th className='m-0 p-0' scope="col">Year</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='m-0 p-0'>
                                                        {
                                                            leadObj?.clientObj?.experienceArr && leadObj?.clientObj?.experienceArr.length > 0 && leadObj?.clientObj?.experienceArr.map((el, index) => {
                                                                return (
                                                                    <tr className='m-0 p-0' key={index}>
                                                                        <td className='m-0 ps-0'>{el.company ? el.company : "N.A."}</td>
                                                                        <td className='m-0 ps-0'>{el?.companyDetail ? el?.companyDetail : "N.A."}</td>
                                                                        <td className='m-0 ps-0'>{el?.year ? el?.year : "N.A."}</td>
                                                                    </tr>

                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                                <h4 className='mt-5'>Details</h4>
                                                <table class="table">
                                                    <thead>
                                                        <tr className='m-0 p-0'>
                                                            <th className='m-0 p-0' scope="col">Heading</th>
                                                            <th className='m-0 p-0' scope="col">Values</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='m-0 p-0'>
                                                        {
                                                            leadObj?.clientObj?.contactInfoArr && leadObj?.clientObj?.contactInfoArr.length > 0 && leadObj?.clientObj?.contactInfoArr.map((el, index) => {
                                                                return (
                                                                    <tr className='m-0 p-0' key={index}>
                                                                        <td className='m-0 ps-0'>{el.heading ? el.heading : "N.A."}</td>
                                                                        <td className='m-0 ps-0'>{el?.dataArr && el.dataArr?.length > 0 ? el?.dataArr.map((ele, index) => {
                                                                            return (
                                                                                <p key={index}>{ele}</p>
                                                                            )
                                                                        }) : "N.A."}</td>
                                                                    </tr>

                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </DashboardTable>
                                </div>
                            </div>


                            <hr />

                            <DashboardTable>

                                <h4>Lead History</h4>
                                <table class="table">
                                    <thead>
                                        <tr className='m-0 p-0'>
                                            <th className='m-0 p-0' scope="col">Previous Value</th>
                                            <th className='m-0 p-0' scope="col">Value</th>
                                            <th className='m-0 p-0' scope="col">Message</th>
                                            <th className='m-0 p-0' scope="col">Done On</th>
                                        </tr>
                                    </thead>
                                    <tbody className='m-0 p-0'>
                                        {
                                            leadHistoryArr && leadHistoryArr.length > 0 ? leadHistoryArr.map((el, index) => {
                                                return (
                                                    <tr className='m-0 p-0' key={index}>
                                                        <td className='m-0 ps-0'>{el?.previousValue ? el?.previousValue : "N.A."}</td>
                                                        <td className='m-0 ps-0'>{el.value ? el.value : "N.A."}</td>
                                                        <td className='m-0 ps-0'>{el?.message ? el?.message : "N.A."}</td>
                                                        <td className='m-0 ps-0'>{el?.createdAt ? `${new Date(el?.createdAt).toDateString()} at ${new Date(el.createdAt).getHours()}:${new Date(el.createdAt).getMinutes()}` : "N.A."}</td>
                                                    </tr>
                                                )
                                            })
                                                :
                                                <tr className='m-0 p-0'>
                                                    <td className='m-0 ps-0' colSpan={3}>No history found for this lead</td>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                            </DashboardTable>


                            <hr />

                            <DashboardTable>

                                <h4>Previously appeared in the following campaigns</h4>
                                <table class="table">
                                    <thead className='m-0 p-0'>
                                        <tr className='m-0 p-0'>
                                            <th className='m-0 p-0' scope="col">Name</th>
                                            <th className='m-0 p-0' scope="col">Done On</th>
                                            <th className='m-0 p-0' scope="col">View</th>
                                        </tr>
                                    </thead>
                                    <tbody className='m-0 p-0'>
                                        {
                                            previousLeadsArr && previousLeadsArr.length > 0 ? previousLeadsArr.map((el, index) => {
                                                return (
                                                    <tr className='m-0 p-0' key={index}>
                                                        <td className='m-0 ps-0'>{el?.campaignName ? el?.campaignName : "N.A."}</td>
                                                        <td className='m-0 ps-0'>{el?.createdAt ? `${new Date(el?.createdAt).toDateString()} at ${new Date(el.createdAt).getHours()}:${new Date(el.createdAt).getMinutes()}` : "N.A."}</td>
                                                        <td className='m-0 ps-0'>
                                                            <CustomButton
                                                                isBtn
                                                                btntype="button"
                                                                btnStyle={{
                                                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                                                    color: "black",
                                                                    border: "solid 1px grey"
                                                                }}
                                                                btnName={"View Details"}
                                                                ClickEvent={(e) => {
                                                                    e.preventDefault();
                                                                    setSelectedPreviousLead(el)
                                                                    setModalBox(true)
                                                                }}
                                                            />


                                                        </td>
                                                    </tr>
                                                )
                                            })
                                                :
                                                <tr>
                                                    <td colSpan={3}>Did not appear in any previous campaigns</td>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                            </DashboardTable>




                            <hr />

                            <CustomButton
                                isBtn
                                btnStyle={{
                                    backgroundColor: "rgba(174, 8, 38, 0.5)",
                                    color: "white"
                                }}
                                btntype="button"
                                btnName={"Add Deal to Savanta"}
                                ClickEvent={(e) => {
                                    e.preventDefault();

                                    handleAddDealToSavanta()

                                }}
                            />
                            {/* <CustomButton
                                isBtn
                                btntype="button"
                                btnStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                    color: "black",
                                    border: "solid 1px grey"
                                }}
                                extraClass={"ms-4"}
                                btnName={"Message Founder"}
                                ClickEvent={(e) => {
                                    e.preventDefault();
                                }}
                            /> */}




                            <Modal open={ModalBox} onClose={() => setModalBox(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                                <Box className="modal-box">
                                    <div className="modal-container" style={{ minWidth: "70vw", maxWidth: "100vw" }}>
                                        <div className="modal-header">
                                            <h4>Details for Campaign {selectedPreviousLead?.campaignName} created on {selectedPreviousLead?.createdAt ? `${new Date(selectedPreviousLead?.createdAt).toDateString()} at ${new Date(selectedPreviousLead.createdAt).getHours()}:${new Date(selectedPreviousLead.createdAt).getMinutes()}` : "N.A."} </h4>
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
                                        <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>

                                            <div className='row'>


                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Founder Name</th>
                                                            <th scope="col">Owner</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{selectedPreviousLead?.name}</td>
                                                            <td>{selectedPreviousLead?.currentPosition}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>


                                            </div>

                                            <hr />


                                            <div className="row d-flex justify-content-between">

                                                <div className="col-12">
                                                    <div className='row'>
                                                        <div>
                                                            <h4 className='pt-2'>Education</h4>
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
                                                                        selectedPreviousLead?.educationArr && selectedPreviousLead?.educationArr.length > 0 && selectedPreviousLead?.educationArr.map((el, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{el.schoolName ? el.schoolName : "N.A."}</td>
                                                                                    <td>{el?.schoolDetail ? el?.schoolDetail : "N.A."}</td>
                                                                                    <td>{el?.year ? el?.year : "N.A."}</td>
                                                                                </tr>

                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            <h4 className='mt-5'>Experience</h4>
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
                                                                        selectedPreviousLead?.experienceArr && selectedPreviousLead?.experienceArr.length > 0 && selectedPreviousLead?.experienceArr.map((el, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{el.company ? el.company : "N.A."}</td>
                                                                                    <td>{el?.companyDetail ? el?.companyDetail : "N.A."}</td>
                                                                                    <td>{el?.year ? el?.year : "N.A."}</td>
                                                                                </tr>

                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            <h4 className='mt-5'>Details</h4>
                                                            <table class="table">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">Heading</th>
                                                                        <th scope="col">Values</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        selectedPreviousLead?.contactInfoArr && selectedPreviousLead?.contactInfoArr.length > 0 && selectedPreviousLead?.contactInfoArr.map((el, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{el.heading ? el.heading : "N.A."}</td>
                                                                                    <td>{el?.dataArr && el.dataArr?.length > 0 ? el?.dataArr.map((ele, index) => {
                                                                                        return (
                                                                                            <p key={index}>{ele}</p>
                                                                                        )
                                                                                    }) : "N.A."}</td>
                                                                                </tr>

                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </Box>
                            </Modal>

                        </div>
                    </div>
                </div>
            </section>
        </main >
    )
}
