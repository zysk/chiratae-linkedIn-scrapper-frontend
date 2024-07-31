import { Input, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer';
import { createlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { addUser, updateUser } from '../../services/users.service';
import { toastError, toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';
import { ConfirmModal } from '../Utility/ConfirmationModal';
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";

const COMFIRMATION_DATA = {
    update_user: {
        type:"update_user",
        heading: "Are you sure ?", 
        title:"You can't revert changes"
    },
}
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^[0-9]{10,15}$/;


export default function AddUsers({ selectedUser, setSelectedUser, setChange }) {
    const [confirmModal, setConfirmModal] = useState(false);
    const[confirmModalData,setConfirmModalData] = useState({})
    
    const openConfirmModal = (data,row_id)=>{
        setConfirmModal(true);
        setConfirmModalData({...data,row_id});
    }

    const OnModalConfirm = (data) => {
        setConfirmModal(false);
        switch (data.type){
            case"update_user":{
                handleUpdateUser(data.user_data)
                break;
            }
            default :
                break;
        }
    }

	const schema = yup.object().shape({
		name: yup.string()
						.required("Name is Required")
						.min(3, "Name should be at least 3 characters")
						.max(50, "Name should not exceed 50 characters"),
		email: yup.string()
                        .matches(emailPattern, 'Invalid email format')
                        .required('Email is required'),
		phone: yup.string()
                        .matches(phonePattern, 'Invalid phone number format')
						.required("Phone is Required"),
		employee_id: yup.string()
						.required("Employee ID is Required"),
		password: yup.string()
						.required("Password is Required"),
        is_active:yup.boolean()
	});

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
            resolver: yupResolver(schema),
            defaultValues:{
                name: "",
                email: "",
                phone: "",
                employee_id: "",
                password: "",
                is_active:false
            }
        });

    const handleAddCategory = async (data) => {
        try {
            let obj = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                employeeId: data.employee_id,
                isActive: data.is_active,
                role: "USER"
            };
            if (data.password) {
                obj.password = Buffer.from(data.password).toString("base64")
            }
            if (selectedUser && selectedUser.name) {
                openConfirmModal({...COMFIRMATION_DATA.update_user, user_data: obj })
            }
            else {
                let { data: res } = await addUser(obj);
                if (res.success) {
                    toastSuccess(res.message);
                    setChange(prev => prev + 1)
                }
                reset({});
            }
        }
        catch (err) {
            toastError(err);
        }
            // dispatch(CATEGORYAdd(obj));
        }

  
    const onSubmitHandler = (data) => {
        handleAddCategory(data);
    };

    useEffect(() => {
        if (selectedUser && selectedUser.name) {
            reset({
                name: selectedUser?.name,
                email: selectedUser?.email,
                phone: selectedUser?.phone,
                employee_id: selectedUser?.employeeId,
                // password: selectedUser?.password,
                is_active:selectedUser?.isActive
            })
            // dispatch(CATEGORYGet());
        }
    }, [selectedUser,reset]);

    const handleUpdateUser = async (obj) => {
        let { data: res } = await updateUser(obj, selectedUser?._id);
        if (res.success) {
            toastSuccess(res.message);
            setSelectedUser({})
            setChange(prev => prev + 1)
            reset({
                name: "",
                email: "",
                phone: "",
                employee_id: "",
                password: "",
                is_active:false
            })
        }
    };

    return (

        <div className={"makeChange "}>
            <form className="form row" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Name <span className="red">*</span>
                    </label> */}
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                            <TextField 
                                sx={{ borderRadius: 5 }} 
                                id="outlined-basic" 
                                label="Name" 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.target.value)}
                                type="text" 
                                className="form-control"
                            />
                        )
                    }
                    />
                    {errors.name && <div className="text-danger mt-1">{errors.name.message}</div>}
                </div>
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Email <span className="red">*</span>
                    </label> */}
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                            <TextField 
                                sx={{ borderRadius: 5 }} 
                                id="outlined-basic" 
                                label="Email" 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.target.value)}
                                type="text" 
                                className="form-control"
                            />
                        )
                    }
                    />
                    {errors.email && <div className="text-danger mt-1">{errors.email.message}</div>}
                </div>
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Phone Number <span className="red">*</span>
                    </label> */}
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                            <TextField 
                                sx={{ borderRadius: 5 }} 
                                id="outlined-basic" 
                                label="Phone Number" 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.target.value)}
                                type="text" 
                                className="form-control"
                            />
                        )
                    }
                    />
                    {errors.phone && <div className="text-danger mt-1">{errors.phone.message}</div>}
                        
                </div>
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Employee Id <span className="red">*</span>
                    </label> */}
                    <Controller
                      name="employee_id"
                      control={control}
                      render={({ field }) => (
                            <TextField 
                                sx={{ borderRadius: 5 }} 
                                id="outlined-basic" 
                                label="Employee Id" 
                                value={field.value} 
                                onChange={(e) => field.onChange(e.target.value)}
                                type="text" 
                                className="form-control"
                            />
                        )
                    }
                    />
                    {errors.employee_id && <div className="text-danger mt-1">{errors.employee_id.message}</div>}
                </div>
                <div className={"col-6"}>
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
                                type="text" 
                                className="form-control"
                            />
                        )
                    }
                    />
                    {errors.password && <div className="text-danger mt-1">{errors.password.message}</div>}
                </div>
                <div className='row'>
                    <div className={"col-6"}>
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => (
                        <>
                            <input 
                                checked={field.value} 
                                onChange={(e) =>field.onChange(e.target.checked)} type="checkbox" />
                            <label className="blue-1 ms-2 fs-12">
                                Is Active
                            </label>
                        </>

                        )
                    }
                    />
                    </div>
                    <div className="col-6 text-end">
                        <CustomButton btntype="submit" changeClass="me-4 btn btn-1 btn-outline" iconName="fa-solid fa-check" btnName="Save " isBtn small={false} />
                    </div>
                </div>

            </form>
            <ConfirmModal
                ModalBox={confirmModal}
                modalData= {confirmModalData}
                onCancel = {()=>{setConfirmModal(false);}}
                onConfirm={OnModalConfirm}
            >
            </ConfirmModal>
        </div>
    );
}