import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import {Buffer} from 'buffer';
import { createlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { toastError, toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function AddLinkedInAccount({ makeChange, OnAccountAdded }) {

    const schema = yup.object().shape({
		email: yup.string()
                    .matches(emailPattern, 'Invalid email format')
                    .required('Email is required'),
		password: yup.string()
					.required("Password is Required"),
	});


  const { control, handleSubmit, formState: { errors}, reset } = useForm({
		resolver: yupResolver(schema),
		defaultValues:{
			email: "",
			password: "",
		}
	  });
  

    const handleAddCategory = async (data) => {
        try {

            let obj = {
                name: data.email,
                password: Buffer.from(data.password).toString("base64"),
            };

            let { data: res } = await createlinkedInAccount(obj);
            if (res.success) {
                toastSuccess(res.message);
                OnAccountAdded()
                reset({});
            }
        }
        catch (err) {
            toastError(err);
        }
        // dispatch(CATEGORYAdd(obj));
    };

    useEffect(() => {
        // dispatch(CATEGORYGet());
    }, []);

    const onSubmitHandler = (data) => {
        handleAddCategory(data);
	};

    return (
        <div className={makeChange ? "makeChange" : ""}>
            <form className="form row" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className={makeChange ? "col-6 col-md-6" : "col-6"}>
                    {/* <label className="blue-1 fs-12">
                         <span className="red">*</span>
                    </label> */}
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                            sx={{ borderRadius: 5 }} 
                            id="outlined-basic" 
                            label="Linked email" 
                            value={field.value} 
                            onChange={(e) => field.onChange(e.target.value)}
                            type="text" 
                            className="form-control"
                        />
                        )
                    }
                    />
                    {errors.email && <div className="text-danger mt-4">{errors.email.message}</div>}
                </div>
                <div className={makeChange ? "col-6 col-md-6" : "col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Password <span className="red">*</span>
                    </label> */}
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                            sx={{ borderRadius: 5 }} 
                            id="outlined-basic" 
                            label="Password" 
                            value={field.value} 
                            onChange={(e) => field.onChange(e.target.value)}
                            type="password"
                            className="form-control"
                        />
                        )
                    }
                    />
                    {errors.password && <div className="text-danger mt-4">{errors.password.message}</div>}
                </div>
                <div className="col-12 text-end mt-4">
                    <CustomButton btntype="submit" iconName="fa-solid fa-check" changeClass="me-4 btn btn-1 btn-outline" btnName="Save" isBtn small={makeChange ? true : false} />
                </div>
            </form>
        </div>
    );
}
