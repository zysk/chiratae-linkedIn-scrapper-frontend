import { FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { createlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { getById, updateUser } from '../../services/users.service';
import { toastError, toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';
import { Buffer } from "buffer";
import { DashboardBox } from '../Utility/DashboardBox';
import { useSelector, useDispatch } from "react-redux";
import { Box } from '@mui/system';
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const hostnamePattern = /^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*$/;

export default function Profile({ selectedUser, setSelectedUser, setChange }) {

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

    const user = useSelector((state) => state.auth.user);

    const [name, setName] = useState("");

    const handleGet = async () => {
        try {
            let { data: res } = await getById(user?._id);
            if (res.success) {
                reset({
                    mailHost: res?.data?.mailSettingsObj?.mailHost,
                    mailPort: res?.data?.mailSettingsObj?.mailPort,
                    mailUserName: res?.data?.mailSettingsObj?.mailUserName,
                    mailUserPassword: res?.data?.mailSettingsObj?.mailUserPassword,
                    mailService: res?.data?.mailSettingsObj?.mailService,
                    mailEncryption: res?.data?.mailSettingsObj?.mailEncryption
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


    const handleAdd = async (data) => {
        try {

            let obj = {
                mailSettingsObj :{
                    mailHost: data.mailHost,
                    mailPort: data.mailPort,
                    mailUserName: data.mailUserName,
                    mailUserPassword: data.mailUserPassword,
                    mailEncryption: data.mailEncryption,
                    mailService: data.mailService
                }
            };

            let { data: res } = await updateUser(
              {
                ...obj,
                mailUserPassword: Buffer.from(data.mailUserPassword).toString("base64"),
            },
              user?._id
            );
            if (res.success) {
                toastSuccess(res.message);
            }
        }
        catch (err) {
            toastError(err);
        }
    };


    return (
        <section className="product-category">

            <div className="container-fluid p-0 m-4">
                <div className="row">
                    <div className="col-12 col-md-11">
                        <DashboardBox>

                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5>Your Email Settings</h5>
                            </div>

                            <div className={"makeChange "}>
                                <form className="form row" onSubmit={handleSubmit(onSubmitHandler)}>
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
                                    </div>
                                    <div className='row'>
                                        <div className="col-12 text-end">
                                            <CustomButton btntype="submit" changeClass="me-4 btn btn-1 btn-outline" iconName="fa-solid fa-check" btnName="Save " isBtn small={false} />
                                        </div>

                                    </div>

                                </form>
                            </div>
                        </DashboardBox>
                    </div>
                </div>
            </div>
        </section>
    );
}