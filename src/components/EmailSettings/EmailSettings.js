import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import ReactSelect from 'react-select';
import { addEmailSettings, getEmailSettings } from '../../services/EmailSettings.service';
import { CreateLeadStatus } from '../../services/LeadStatus.service';
import CustomButton from '../Utility/Button';
import { DashboardBox, DashboardTable } from '../Utility/DashboardBox';
import { toastError, toastSuccess } from '../Utility/ToastUtils';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { BiDotsVerticalRounded } from 'react-icons/bi';
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const hostnamePattern = /^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*$/;

export default function EmailSettings() {

    const schema = yup.object().shape({
		mailHost: yup.string()
						.required("Host Name is Required")
                        .matches(hostnamePattern, 'Invalid hostname format'),
		mailPort : yup.string()
                        .required("Port Number is Required")
                        .matches(/^[0-9]+$/, 'Port Number must be only digits')
						.min(2, "Port Number should be at least 2 digits")
						.max(3, "Port Number should not exceed 3 digits"),
		mailUserName: yup.string()
                        .required('Username is required')
                        .matches(emailPattern, 'Invalid email format'),
        mailUserPassword: yup.string()
                        .required("Password is Required"),
		mailService: yup.string()
						.required("Service is Required")
						.max(50, "Service should not exceed 50 characters"),
		mailEncryption: yup.string()
						.required("Encryption is Required")
	});

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
		resolver: yupResolver(schema),
		defaultValues:{
			mailHost: "",
			mailPort: "",
			mailUserName: "",
			mailUserPassword: "",
			mailService: "",
            mailEncryption:""
		}
	  });

      const onSubmitHandler = (data) => {
        handleAdd(data);
	};
    // ==============================================================================================================
    const [emailSettingsObj, setEmailSettingsObj] = useState([]);


    const [mailFromAddress, setMailFromAddress] = useState("");
    const [mailFromName, setMailFromName] = useState("");

    const [companyOptions, setCompanyOptions] = useState("");



    const handleGet = async () => {
        try {
            let { data: res } = await getEmailSettings();
            if (res.success) {
                setEmailSettingsObj(res.data)
                setMailFromAddress(res.data.mailFromAddress)
                setMailFromName(res.data.mailFromName)
                reset({
                    mailHost: res.data.mailHost,
                    mailPort: res.data.mailPort,
                    mailUserName: res.data.mailUserName,
                    mailUserPassword: res.data.mailUserPassword,
                    mailService: res.data.mailService,
                    mailEncryption: res.data.mailEncryption
                })
            }
        }
        catch (err) {
            toastError(err);
        }
    };


    useEffect(() => {
        handleGet()
    }, [])


    const [value, setValue] = useState("");

    const handleAdd = async (data) => {
        try {
            let obj = {
                mailFromAddress,
                mailFromName,
                mailHost: data.mailHost,
                mailPort: data.mailPort,
                mailUserName: data.mailUserName,
                mailUserPassword: Buffer.from(data.mailUserPassword).toString("base64"),
                mailEncryption: data.mailEncryption,
                mailService: data.mailService
            };
            let { data: res } = await addEmailSettings(obj);
            if (res.success) {
                toastSuccess(res.message);
                handleGet()
            }
        }
        catch (err) {
            toastError(err);
        }
    };



    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };





    // ==============================================================================================================

    return (
        <main>

            <section className="product-category">
                <div class="container-fluid">
                    <div class="row">
                        <div class="breadcumarea">
                            <h4>Email Settings</h4>
                            <div class="breadcum">
                                <ul>
                                    <li>Settings</li>
                                    <li className='active'>Email Settings</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-12 col-md-12">
                            <DashboardBox>
                                <div className={"makeChange"}>
                                    {/* <div className='breadcumarea'>
                                        <h4>Add LinkedIn Account</h4>
                                    </div> */}
                                    <form className="form row" onSubmit={handleSubmit(onSubmitHandler)}>
                                        {/* <div className={"col-6"}>

                                            <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Mail From Address" value={mailFromAddress} onChange={(event) => setMailFromAddress(event.target.value)} type="text" className="form-control" />
                                        </div>
                                        <div className={"col-6"}>

                                            <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label=" Mail From Name" value={mailFromName} onChange={(event) => setMailFromName(event.target.value)} type="text" className="form-control" />
                                        </div> */}
                                        <div className={"col-6"}>
                                            <Controller
                                                name="mailHost"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField 
                                                        sx={{ borderRadius: 5 }} 
                                                        id="outlined-basic" 
                                                        label="Mail Host" 
                                                        value={field.value} 
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        type="text" 
                                                        className="form-control"
                                                    />
                                                    )
                                                }
                                            />
                                            {errors.mailHost && <div className="text-danger mt-2">{errors.mailHost.message}</div>}
                                        </div>
                                        <div className={"col-6"}>
                                            <Controller
                                                name="mailPort"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField 
                                                        sx={{ borderRadius: 5 }} 
                                                        id="outlined-basic" 
                                                        label="Mail Port" 
                                                        value={field.value} 
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        type="text" 
                                                        className="form-control"
                                                    />
                                                    )
                                                }
                                            />
                                            {errors.mailPort && <div className="text-danger mt-2">{errors.mailPort.message}</div>}
                                        </div>
                                        <div className={"col-6"}>
                                            <Controller
                                                name="mailUserName"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField 
                                                        sx={{ borderRadius: 5 }} 
                                                        id="outlined-basic" 
                                                        label="Mail User Name" 
                                                        value={field.value} 
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        type="text" 
                                                        className="form-control"
                                                    />
                                                    )
                                                }
                                            />
                                            {errors.mailUserName && <div className="text-danger mt-2">{errors.mailUserName.message}</div>}
                                        </div>
                                        <div className={"col-6"}>
                                            <Controller
                                                name="mailUserPassword"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField 
                                                        sx={{ borderRadius: 5 }} 
                                                        id="outlined-basic" 
                                                        label="Mail Password" 
                                                        value={field.value} 
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        type="password" 
                                                        className="form-control"
                                                    />
                                                    )
                                                }
                                            />
                                            {errors.mailUserPassword && <div className="text-danger mt-2">{errors.mailUserPassword.message}</div>}
                                        </div>
                                        <div className={"col-6"}>
                                            <Controller
                                                name="mailService"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField 
                                                        sx={{ borderRadius: 5 }} 
                                                        id="outlined-basic" 
                                                        label="Mail Service" 
                                                        value={field.value} 
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        type="text" 
                                                        className="form-control"
                                                    />
                                                    )
                                                }
                                            />
                                            {errors.mailService && <div className="text-danger mt-2">{errors.mailService.message}</div>}
                                        </div>
                                        <div className={"col-6"}>
                                            {/* <label className="blue-1 fs-12">
                                                Mail Encryption <span className="red">*</span>
                                            </label> */}
                                            <Controller
                                                name="mailEncryption"
                                                control={control}
                                                render={({ field }) => (
                                                    <Box sx={{ minWidth: 120 }}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Mail Encryption</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={field.value} 
                                                                label="Mail Encryption"
                                                                onChange={(e) => field.onChange(e.target.value)}

                                                            >
                                                                <MenuItem value='SSL'>SSL</MenuItem>
                                                                <MenuItem value='TLS'>TLS</MenuItem>

                                                            </Select>
                                                        </FormControl>
                                                    </Box>
                                                    )
                                                }
                                            />
                                            {errors.mailEncryption && <div className="text-danger mt-2">{errors.mailEncryption.message}</div>}

                                            {/* <ReactSelect value={{ label: mailEncryption, value: mailEncryption }} onChange={(e) => setMailEncryption(e.value)} options={[{ label: "SSL", value: "SSL" }, { label: "TLS", value: "TLS" }]} /> */}

                                            {/* <input value={mailEncryption} onChange={(event) => setMailEncryption(event.target.value)} type="text" className="form-control" /> */}
                                        </div>


                                        <div className="col-12 text-end mt-2">
                                            <CustomButton btntype="submit" iconName="fa-solid fa-check" changeClass="me-4 btn btn-1 btn-outline" btnName="Save" isBtn small={true} />
                                        </div>
                                    </form>
                                </div>
                            </DashboardBox>
                        </div>
                        {/* <div className="col-12 col-md-12">
                            <DashboardTable>
                                <div className='breadcumarea mb-3'>
                                    <h4>Add LinkedIn Account</h4>
                                </div>
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Mail From Name</th>
                                            <th>Mail From Address</th>
                                            <th>Mail Host</th>
                                            <th>Mail Port</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Mohd Basit</td>
                                            <td>mohdbasit972@gmail.com</td>
                                            <td>smtp.gmail.com</td>
                                            <td>{mailFromAddress ? mailFromAddress : "N.A."}</td>
                                            <td> <i class="fa fa-ellipsis-v"></i> </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Mohd Basit</td>
                                            <td>mohdbasit972@gmail.com</td>
                                            <td>smtp.gmail.com</td>
                                            <td>{mailFromAddress ? mailFromAddress : "N.A."}</td>
                                            <td> <i class="fa fa-ellipsis-v"></i> </td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Mohd Basit</td>
                                            <td>mohdbasit972@gmail.com</td>
                                            <td>smtp.gmail.com</td>
                                            <td>{mailFromAddress ? mailFromAddress : "N.A."}</td>
                                            <td> <i class="fa fa-ellipsis-v"></i> </td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>Mohd Basit</td>
                                            <td>mohdbasit972@gmail.com</td>
                                            <td>smtp.gmail.com</td>
                                            <td>{mailFromAddress ? mailFromAddress : "N.A."}</td>
                                            <td> <i class="fa fa-ellipsis-v"></i> </td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>Mohd Basit</td>
                                            <td>mohdbasit972@gmail.com</td>
                                            <td>smtp.gmail.com</td>
                                            <td>{mailFromAddress ? mailFromAddress : "N.A."}</td>
                                            <td> <i class="fa fa-ellipsis-v"></i> </td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>Mohd Basit</td>
                                            <td>mohdbasit972@gmail.com</td>
                                            <td>smtp.gmail.com</td>
                                            <td>{mailFromAddress ? mailFromAddress : "N.A."}</td>
                                            <td> <i class="fa fa-ellipsis-v"></i> </td>
                                        </tr>
                                        <tr>
                                            <td>7</td>
                                            <td>Mohd Basit</td>
                                            <td>mohdbasit972@gmail.com</td>
                                            <td>smtp.gmail.com</td>
                                            <td>{mailFromAddress ? mailFromAddress : "N.A."}</td>
                                            <td> <i class="fa fa-ellipsis-v"></i> </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </DashboardTable>
                        </div> */}
                    </div>
                </div>
            </section>
        </main>
    );
}

