import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CreateLeadStatus } from '../../services/LeadStatus.service';
import { createproxies } from '../../services/Proxy.service';
import { toastError, toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";

export default function AddLeadStatus({ makeChange, setChangeCount }) {
    const schema = yup.object().shape({
		value: yup.string()
                .required('Value is required'),
	});

    const { control, handleSubmit, formState: { errors}, reset } = useForm({
		resolver: yupResolver(schema),
		defaultValues:{
			value: "",
		}
	  });


    const handleAdd = async (data) => {
        try {

            let obj = {
                value:data.value,
            };
            let { data: res } = await CreateLeadStatus(obj);
            if (res.success) {
                toastSuccess(res.message);
                setChangeCount(prev => prev + 1)
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
        handleAdd(data);
	};


    return (
        <div className={makeChange ? "makeChange" : ""}>
            <form className="form row" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className={makeChange ? "col-12 col-md-6" : "col-12"}>
                    {/* <label className="blue-1 fs-12">
                         <span className="red">*</span>
                    </label> */}
                    <Controller
                      name="value"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                            sx={{ borderRadius: 5 }} 
                            id="outlined-basic" 
                            label="Value" 
                            value={field.value} 
                            onChange={(e) => field.onChange(e.target.value)}
                            type="text" 
                            className="form-control"
                        />
                        )
                    }
                    />
                    {errors.value && <div className="text-danger mt-4">{errors.value.message}</div>}
                </div>


                <div className="col-12 text-end mt-5">
                    <CustomButton btntype="submit" iconName="fa-solid fa-check" changeClass="me-4 btn btn-1 btn-outline" btnName="Save" isBtn small={makeChange ? true : false} />
                </div>
            </form>
        </div>
    );
}
