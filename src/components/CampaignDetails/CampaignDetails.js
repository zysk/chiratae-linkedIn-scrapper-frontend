import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import { getPastcampaignById, getsearchedOnLinkedinById, searchFromLinkedin } from '../../services/Campaign.service';
import { toastError } from '../../utils/toastUtils';
import { DashboardBox } from '../Utility/DashboardBox'

export default function CampaignDetails() {
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [school, setSchool] = useState("");
    const [company, setCompany] = useState("");
    const [resultsArr, setResultsArr] = useState([]);
    const [resultObj, setResultObj] = useState({});
    const [resultsText, setResultsText] = useState("");
    const params = useParams()

    const location = useLocation();
    const handleGetSearchResult = async () => {
        try {

            let { data: res } = await getPastcampaignById(params.id)
            console.log(res.data)
            if (res.data) {
                setAccountName(res.data.accountName)
                setPassword(res.data.password)
                setSearchQuery(res.data.searchQuery)
                setSchool(res.data.school)
                setCompany(res.data.company)
                setResultsArr(res.data.resultsArr)
                setResultsText(res.data.totalResults)
                setResultObj(res.data)
            }
        }
        catch (err) {
            toastError(err)
        }
    }

    useEffect(() => {
        handleGetSearchResult()
    }, [])


    return (
        <section className="mb-5">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-12 mt-4" >
                        <DashboardBox>
                            {/* <h3 className="blue-1">Search for linkedIn</h3> */}
                            <h4 className="blue-1">Search query</h4>
                            <h6 className="blue-1 mt-2">Search query</h6>
                            <input disabled type="text" className='form-control' placeholder='Search Query' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <h6 className="blue-1 mt-2">Company</h6>
                            <input disabled type="text" className='form-control' placeholder='Company' value={company} onChange={(e) => setCompany(e.target.value)} />
                            <h6 className="blue-1 mt-2">School</h6>
                            <input disabled type="text" className='form-control' placeholder='School' value={school} onChange={(e) => setSchool(e.target.value)} />
                            <h6 className="blue-1 mt-2">Created on</h6>
                            <input disabled type="text" className='form-control' placeholder='' value={`${new Date(resultObj?.createdAt).toDateString()} at ${new Date(resultObj?.createdAt).getHours()}:${new Date(resultObj?.createdAt).getMinutes()}`} onChange={(e) => setSchool(e.target.value)} />
                        </DashboardBox>

                    </div>

                    <div className="col-12 col-lg-12  mt-2" >
                        <DashboardBox>
                            <h3 className="blue-1">Results     <b>Total results {resultObj?.totalResults}</b></h3>
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
                                                    <td><Link style={{ color: "black" }} to={el._id ? `/User-details/${el._id}` : location.pathname}> {el?.name ? el?.name : "N.A."}</Link></td>
                                                    <td>{el?.currentPosition ? el?.currentPosition : "N.A."}</td>
                                                    <td>{el?.location ? el?.location : "N.A."}</td>
                                                    <td>
                                                        <ul>
                                                            {
                                                                el?.educationArr && el?.educationArr.length > 0 ? el.educationArr.map((el, i) => {
                                                                    return (
                                                                        <li key={i}>{i + 1}.) {el?.value ? el.value : el.schoolName ? el.schoolName : "N.A."} | {el?.year}</li>
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

                    </div>
                </div>
            </div>







        </section >
    )
}