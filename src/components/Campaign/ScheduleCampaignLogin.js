import moment from 'moment';
import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { Buffer } from 'buffer';
import { campaignCheckLogin, campaignSendCaptcha, campaignLinklogin, continueScheduledAfterLogin, linkedInProfileScrapping } from '../../services/Campaign.service';
import { getlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { toastError } from '../../utils/toastUtils';
import { DashboardBox } from '../Utility/DashboardBox'
import { toastSuccess, toastWarning } from '../Utility/ToastUtils';
import { useSearchParams } from 'react-router-dom';

export default function ScheduleCampaignLogin() {

    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [imageNumber, setImageNUmber] = useState(0)
    const [linkedInAccountId, setLinkedInAccountId] = useState("");
    const [linkedInAccountArr, setLinkedinAccountsArr] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loadingCheckLoggedIn, setLoadingCheckLoggedIn] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [disableAllButton, setDisableAllButton] = useState(false)
    const [imageData, setImageData] = useState('')
    const [captchaMessage, setCaptchaMessage] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();



    const handleCaptcha = async () => {
        setLoading(true)
        try {
            let obj = {
                imageNumber: imageNumber
            }
            let res = await campaignSendCaptcha(obj)
            setDisableAllButton(true)
            console.log(res.data)
            if (res.data.isCaptcha) {

                toastSuccess("Captcha Verification Needed")
                setImageData(res.data.imgUrl)
                setCaptchaMessage(res.data.captchaMessage)
            }
            else {
                toastSuccess("Login Successful")
                checkLoginOnInit()
                handleContinue();
            }

        } catch (error) {
            toastError(error)
        }
        setLoading(false)
    }



    const checkLoginOnInit = async () => {
        try {
            setLoadingCheckLoggedIn(true)
            const res = await campaignCheckLogin()
            console.log(res.data.message, res.data)
            if (res.data.message) {
                setLoadingCheckLoggedIn(false)
            }

            setIsLoggedIn(res.data.isLogin)
            if (!res.data.isLogin) {
                toastWarning(res.data.message)
                setShowLogin(true)
                setLoadingCheckLoggedIn(false)
            }
            else {
                toastSuccess(res.data.message)
            }
        } catch (error) {
            setLoadingCheckLoggedIn(false)
            console.error(error)
        }
    }




    const handleAccountsGet = async () => {
        try {
            setLoading(true)
            let { data: res } = await getlinkedInAccount()

            if (res.data) {
                setLoading(false)
                setLinkedinAccountsArr([...res.data]);
            }
        }
        catch (err) {
            setLoading(false)
            toastError(err)
        }
    }



    const handleLogin = async () => {
        try {
            setLoading(true)
            console.log(isLoggedIn, accountName == "" && password == "", isLoggedIn == false && accountName == "" && password == "", "av")
            if (isLoggedIn == false && accountName == "" && password == "") {
                toastError("Please select account to login with")
                return
            }

            let { data: res } = await campaignLinklogin({ accountName, password : Buffer.from(password).toString("base64")})
            console.log("login res",res)
            if (res.isCaptcha || res.imgUrl) {
                toastSuccess("Captcha Verification Needed")
                console.log("res", res)
                setImageData(res.imgUrl)
                setCaptchaMessage(res.captchaMessage)
                setLoading(false)
            }
            else {
                toastSuccess("login Successfull")
                handleContinue();
                setIsLoggedIn(true)
                setShowLogin(false)
                setLoading(false)
            }
        }
        catch (err) {
            setLoading(true)
            toastError(err)
        }
    }

    const handleContinue = async () => {
        try {
            // const endDate = searchParams.get('endDate')
            // const res = await continueScheduledAfterLogin(endDate)
            const res = await linkedInProfileScrapping()
            if(res.data?.message)
            toastSuccess(res.data?.message)

            
        } catch (error) {
            toastError(error)

        }
    }


    useEffect(() => {
        handleAccountsGet()
        checkLoginOnInit()
    }, [])

    const handleChangeValue = (value) => {
        setLinkedInAccountId(value.value);
        setAccountName(value.name)
        setPassword(value.password)
    }


    useEffect(() => {
        console.log("SEARCHPARAMS")
        console.log("SEARCHPARAMS", searchParams.get('endDate'))
    }, [searchParams])



    return (
        <section className="mb-5">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-12" >
                        <DashboardBox className="dashboard-summary">
                            <h3 className="blue-1">Login for Scheduled Campaigns</h3>

                            {
                                loadingCheckLoggedIn == false && showLogin == false &&
                                <>
                                    Already Logged In
                                </>
                            }
                            {
                                loading == false && showLogin &&
                                <>
                                    <hr />
                                    <h4 className="blue-1">Account Section</h4>
                                    <div className="row align-items-center">
                                        <div className="col-6">
                                            <Select onChange={handleChangeValue} options={linkedInAccountArr && linkedInAccountArr.length > 0 ? linkedInAccountArr.map(el => ({ label: `${el.name}`, value: el._id, ...el })) : []} />
                                        </div>
                                        <div className="col-6">
                                            <button disabled={loading} onClick={() => handleLogin()} type={"button"} style={{ outline: "none", border: "none", width: 300, marginRight: 10, padding: "7px 70px", borderRadius: 10, backgroundColor: "#000000", color: 'white' }}>{loadingCheckLoggedIn ? 'Loading...' : "Login"}</button>
                                        </div>
                                    </div>
                                    <hr />

                                </>
                            }

                            {
                                loading == false && showLogin && !!imageData &&
                                <>
                                    <h6 className="blue-1 mt-2">Captcha Required</h6>
                                    <img src={imageData} alt="" srcset="" style={{ height: 200, width: 300 }} />
                                    <h6 className="blue-1 mt-2">
                                        {captchaMessage}
                                    </h6>
                                    <input type="text" className='form-control' placeholder='School' value={imageNumber} onChange={(e) => setImageNUmber(e.target.value)} />
                                    <button onClick={() => handleCaptcha()} type={"button"} style={{ outline: "none", border: "none", width: 300, marginRight: 10, padding: "10px 70px", borderRadius: 10, backgroundColor: "#000000", marginTop: "15px", color: 'white' }}>{loadingCheckLoggedIn ? 'Loading...' : 'Run Now'}</button>
                                </>

                            }



                        </DashboardBox>

                    </div>

                </div>
            </div>

        </section >
    )
}
