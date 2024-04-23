import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getcampaigns, getsearchedOnLinkedin } from '../../services/Campaign.service';
import { toastError } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';
import { DashboardBox } from '../Utility/DashboardBox';
export default function PastCampaigns() {
    const [searchesArr, setSearchesArr] = useState([]);
    const navigate = useNavigate()
    const handleGetPastSearches = async () => {
        try {

            let { data: res } = await getcampaigns()
            if (res.data) {
                setSearchesArr(res.data);
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    useEffect(() => {
        handleGetPastSearches()
    }, [])


    const handleRedirect = (id) => {
        navigate(`/View-Campaign-Detail/${id}`)
    }

    return (


        <div className="newpaddingtoplefgt">

            <div className="container-fluid">
                <div className="row">
                    <div className="breadcumarea">
                        <h4>Past Champaign</h4>
                        <div className="breadcum">
                            <ul>
                                <li>All Leads</li>
                                <li className='active'>Past Champaign</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <section className="mb-5">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-lg-12" >
                            <DashboardBox className="dashboard-summary  dashboard-box">
                                <h3 className="font6updateadmin ">Total Campaigns <b>{searchesArr?.length}</b></h3>
                                <hr />
                                <table class="table tabletd_small" >
                                    <thead>
                                        <tr>
                                            <th scope="col">S.no</th>
                                            <th scope="col">Campaign Name</th>
                                            <th scope="col">Search Query</th>
                                            <th scope="col">Completion Percentage</th>
                                            {/* <th scope="col">School</th> */}
                                            <th scope="col">Total results</th>
                                            <th scope="col">Last Run On</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">View</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            searchesArr && searchesArr.length > 0 && searchesArr.map((el, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{el?.name ? el?.name : "N.A."}</td>
                                                        <td>{el?.searchQuery ? el?.searchQuery : "N.A."}</td>
                                                        <td>{el?.percent && (el?.percent).toFixed(2)} ({el?.completedLeads} out of {el?.totalLeads})</td>
                                                        {/* <td>{el?.company ? el?.company : "N.A."}</td> */}
                                                        {/* <td>{el?.school ? el?.school.split(",").map((el, index) => {
                                                            return (
                                                                <div key={index}>{el}</div>
                                                            )
                                                        }) : "N.A."}</td> */}
                                                        <td>{el?.totalResults}</td>
                                                        <td>{`${new Date(el?.createdAt).toDateString()} at ${new Date(el?.createdAt).getHours()}:${new Date(el?.createdAt).getMinutes()}`}</td>
                                                        <td>{el?.status}</td>
                                                        <td>
                                                            <CustomButton isBtn btntype="button" changeClass="me-4 btn btn-1 " iconName="fa-solid fa-eye" btnName="View Details" path="/Past-searches" roundedPill small ClickEvent={() => handleRedirect(el._id)} />
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            )
                                        }
                                    </tbody>
                                </table>
                            </DashboardBox>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}