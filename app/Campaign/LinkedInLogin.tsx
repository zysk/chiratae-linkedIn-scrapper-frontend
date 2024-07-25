import CardSection from "@/components/CardSection";
import TitleSection from "@/components/TitleSection";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { campaignCheckLogin, campaignLinklogin, campaignSendCaptcha, campaignVerifyOtp, logoutAccount } from "@/utils/services/Campaign.service";
import { getlinkedInAccount } from "@/utils/services/LinkedInAccounts.service";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaInfoCircle } from "react-icons/fa";
import AlertComponent from "@/components/AlertComponent";
import Loading from "@/components/Loading";

interface IntialResponse {
    captcha : boolean;
    imgUrl : string;    
    captchaMessage : string;    
    otpRequired : string;
    otpMessage : string;
}

interface LinkedinLoginProps {
    onLogin: () => void;
    OnCancel:() => void;
    // other props
}


export const LinkedInLogin: React.FC<LinkedinLoginProps> = ({onLogin, OnCancel}) => { 
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [linkedInAccountArr, setLinkedinAccountsArr] = useState<any>([]);
	const [isLinkedinActive,setIsLinkedinActive] = useState(false);
    const [selectedLinkedInAccount, setSelectedLinkedInAccount] = useState<any>({});
    const [intialLoginResponse, setIntialLoginResponse] = useState<IntialResponse | any >({})
    const [otp,setOtp] = useState<string>('')
    const [imageNumber, setImageNumber] = useState<string>('')

    const checkLoginOnInit = async () => {
		try {
		  const res = await campaignCheckLogin();
		
		  if (!res.data.isLogin) {
			toast.error(res.data.message);
		} else {
			setIsLinkedinActive(true);
			toast.success(res.data.message);
		  }
          setIsLoading(false);
		} catch (error) {
		  console.error(error);
		}
	};

    useEffect(() => { 
        getLinkedAccounts();
        checkLoginOnInit();
    }, []);

    const getLinkedAccounts = async () => {
        try {
          let { data: res } = await getlinkedInAccount();
    
          if (res.data) {
            setLinkedinAccountsArr([...res.data]);
          }
        } catch (err) {
          toast.error("Error getting linkedin accounts");
        }
    };
    
    const handleChange = (value:string) =>{
        if (value == 'ClearSelection'){
            setSelectedLinkedInAccount({});
        } else {
            setSelectedLinkedInAccount(linkedInAccountArr.filter((acc:any) => acc._id == value)[0])
        }
    }

    const handleLogin = async () => {
        try {
            const {data : res} = await campaignLinklogin({
                accountName : selectedLinkedInAccount.name,
                password: Buffer.from(selectedLinkedInAccount.password).toString("base64"),
            });
            if (!res.captcha && !res.otpRequired) onLogin()
            setIntialLoginResponse({...res})

        } catch (err) {
            console.log("Error: " , err)


        }
    }

    const HandleSubmit = () => {
        handleLogin();
    } 

    const HandleCaptchaSubmission =  async () => {
        setIsLoading(true);
        try {
          let obj = {
            imageNumber: imageNumber,
          };
          let res = await campaignSendCaptcha(obj);
    
          if(res?.data?.error){
            toast.error(res?.data?.error);
            checkLoginOnInit();
          }
          if (res?.data?.isCaptcha == false && res?.data?.otpRequired == false) {
            checkLoginOnInit();
            toast.success("Login Successful");
            onLogin()
          } else {
            setIntialLoginResponse({... res.data, captcha: res.data?.isCaptcha, captchaMessage: res.data?.message});
          }
          setImageNumber('');
        } catch (error) {
          toast.error("error");
        }
        setIsLoading(false);
      };

    const handleOTPVerification = async () => {
        toast.info('OTP submission')
        setIsLoading(true);
        try {
        let obj = {
            otp,
        };
        let res = await campaignVerifyOtp(obj);
        if (res?.data?.otpRequired == false) {
            checkLoginOnInit();
            toast.success("Login Successful");
        } else if (
            res?.data?.otpRequired == false &&
            res?.data?.isCaptcha == false
        ) {
            checkLoginOnInit();
            toast.success("Login Successful");
            onLogin();
        }
        setOtp('');
        } catch (error) {
            console.log("Error: ", error);
            toast.error("error");
        }
        setIsLoading(false);
    }
    const logout = async ()=> {
        try {
            setIsLoading(true);
            let { data: res } = await logoutAccount();
            if (res.message) {
                toast.success('Logged out successfully');
                setIsLoading(false);
                setIsLinkedinActive(false);
            }
          } catch (err) {
            setIsLoading(true);    
            toast.error("Error");
          }

    }
    return (
        <>
            {
                isLoading ? 
                <Loading />
                :
                <CardSection title='LinkedIn Account Selection' description=''>
                    {
                        isLinkedinActive && 
                        <div className="-mt-4 flex w-full justify-end items-center py-4">

                                    <AlertComponent
                                        title = "User has Aleady Logged In" 
                                        description="If you want to log in with other account logout to proceed"
                                        actions = {[
                                            {
                                                label: 'Logout',
                                                onClick: () => {
                                                    logout()
                                                },
                                                cssClass:'bg-[#D68392] hover:bg-[#d68392b0]'
                                            },
                                            {
                                                label:'Cancel',
                                                onClick: () => {
                                                    OnCancel()
                                                },
                                                cssClass:'bg-white hover:bg-white text-[#D68392] hover:text-[#d68392b0] border border-[#D68392] hover:border-[#d68392b0]'
                                            }
                                        ]}
                                    />
                                        
                        </div>
                    }
                    <div className='flex items-center'>
                        <div className="flex flex-col w-1/3 space-y-1.5 pe-4">
                            <Select 
                                value={selectedLinkedInAccount._id} onValueChange={handleChange} 
                                disabled={intialLoginResponse.captcha || intialLoginResponse.otpRequired || isLinkedinActive}>
                            <SelectTrigger >
                                    <SelectValue placeholder="Select an account" />
                            </SelectTrigger>
                                <SelectContent position="popper">
                                <SelectItem value="ClearSelection">Clear</SelectItem>
                                    {
                                        linkedInAccountArr.map(
                                            (acc :any) => <SelectItem key={acc._id} value={acc._id}>{acc.name}</SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <Button 
                            className={`w-1/6 bg-[#D68392] hover:bg-[#d68392b0] ${ (intialLoginResponse.captcha || intialLoginResponse.otpRequired) && 'hidden'}`}
                            onClick={HandleSubmit}
                            type='submit'
                            disabled={isLinkedinActive}
                        >
                            Login
                        </Button>
                    </div>
                    <div className="py-5">
                        {
                            intialLoginResponse.captcha && 
                            <div className="flex flex-col">
                                <p className="text-blue-700 font-semibold pb-2">{intialLoginResponse.captchaMessage}</p>
                                {/* <img  width={400} alt="captcha"/> */}
                                <div className="w-[450px]">
                                    <AspectRatio ratio={16 / 9}>
                                        <Image 
                                            src={intialLoginResponse.imgUrl} 
                                            width={350} height={100} 
                                            alt="captcha Image" 
                                            className="rounded-md object-cover" />
                                    </AspectRatio>
                                </div>
                                <div className="w-[450px] flex items-center">
                                    <div className="pe-4">
                                        <Input
                                            id="captcha" 
                                            placeholder="Enter Captcha"
                                            onChange={(value)=>{
                                                    setImageNumber(value.target.value)
                                                }
                                            }
                                            value={imageNumber}
                                        />
                                    </div>
                                    <Button 
                                        className={`w-1/6 bg-[#D68392] hover:bg-[#d68392b0]`}
                                        onClick={HandleCaptchaSubmission}
                                        type='submit'
                                    >
                                    Submit
                                    </Button>
                                </div>
                            </div>
                        }
                        {
                            intialLoginResponse.otpRequired && 
                            <div className="flex flex-col">
                                <h6 className="text-blue-700 font-semibold pb-2">OTP Required</h6>
                                <p className="pb-2">{intialLoginResponse.otpMessage}</p>
                                {/* <img  width={400} alt="captcha"/> */}
                                <div className="w-[450px] flex items-center">
                                    <div className="pe-4">
                                        <Input
                                            id="captcha" 
                                            placeholder="Enter OTP"
                                            onChange={(value)=>{
                                                    setOtp(value.target.value)
                                            }
                                            }
                                            value={otp}
                                        />
                                    </div>
                                    <Button 
                                        className={`w-1/6 bg-[#D68392] hover:bg-[#d68392b0]`}
                                        onClick={() => handleOTPVerification}
                                        type='submit'
                                    >
                                    Submit
                                    </Button>
                                </div>
                            </div>
                        }
                    </div>
                    { 
                        !isLinkedinActive &&
                        <p className="font-bold text-red-700 flex items-center">
                            <span className="pe-3"><FaInfoCircle /></span> 
                            Linked Login is required to proceed with New Campaing Creation
                        </p>
                    }
                </CardSection>
            }
        </>
    );
};