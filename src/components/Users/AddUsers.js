import { Input, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer';
import { createlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { addUser, updateUser } from '../../services/users.service';
import { toastError, toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';
import { ConfirmModal } from '../Utility/ConfirmationModal';

const COMFIRMATION_DATA = {
    update_user: {
        type:"update_user",
        heading: "Are you sure ?", 
        title:"You can't revert changes"
    },
}

export default function AddUsers({ selectedUser, setSelectedUser, setChange }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
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
            console.log("Default case");
        }
    }

    const handleAddCategory = async () => {
        try {
            if (name == "") {
                toastError("Name Field cannot be empty!");
                return;
            }
            else if (email == "") {
                toastError("Email Field cannot be empty!");
                return;
            }
            else if (password == "" && !selectedUser && !selectedUser?.name) {
                toastError("Password Field cannot be empty!");
                return;
            }
            // else if (!email.includes("@")) {
            //     toastError("Invalid email!");
            //     return;
            // }
            // else if (!email.includes(".")) {
            //     toastError("Invalid email!");
            //     return;
            // }
            else if (phone == "") {
                toastError("Phone number Field cannot be empty!");
                return;
            }
            else if (employeeId == "") {
                toastError("EmployeeId Field cannot be empty!");
                return;
            }
            let obj = {
                name,
                email,
                phone,
                employeeId,
                isActive,
                role: "USER"
            };
            if (password != "") {
                obj.password = Buffer.from(password).toString("base64")
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
                handleClearState()
            }
        }
        catch (err) {
            toastError(err);
        }
        // dispatch(CATEGORYAdd(obj));
    };

    const handleUpdateUser = async (obj) => {
        let { data: res } = await updateUser(obj, selectedUser?._id);
        if (res.success) {
            toastSuccess(res.message);
            setSelectedUser({})
            setChange(prev => prev + 1)
            handleClearState();
        }
    };
    
    useEffect(() => {
        if (selectedUser && selectedUser.name) {
            setName(selectedUser?.name)
            setEmail(selectedUser?.email)
            setPhone(selectedUser?.phone)
            setEmployeeId(selectedUser?.employeeId)
            setIsActive(selectedUser?.isActive)
            // setPassword(selectedUser?.password)
            // dispatch(CATEGORYGet());
        }
    }, [selectedUser]);

    const handleClearState = () => {
        setName("")
        setEmail("")
        setPhone("")
        setEmployeeId("")
        setPassword("")
    }

    return (




        <div className={"makeChange "}>
            <form action="#" className="form row">
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Name <span className="red">*</span>
                    </label> */}
                    <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Name" value={name} onChange={(event) => setName(event.target.value)} type="text" className="form-control" />
                </div>
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Email <span className="red">*</span>
                    </label> */}
                    <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="form-control" />
                </div>
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Phone Number <span className="red">*</span>
                    </label> */}
                    <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Phone Number" value={phone} onChange={(event) => setPhone(event.target.value)} type="number" className="form-control" />
                </div>
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Employee Id <span className="red">*</span>
                    </label> */}
                    <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label=" Employee Id" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} type="text" className="form-control" />
                </div>
                <div className={"col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Password <span className="red">*</span>
                    </label> */}
                    <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="form-control" />
                </div>
                <div className='row'>
                    <div className={"col-6"}>
                        <input checked={isActive} onChange={(event) => setIsActive(event.target.checked)} type="checkbox" />
                        <label className="blue-1 ms-2 fs-12">
                            Is Active
                        </label>
                    </div>
                    <div className="col-6 text-end">
                        <CustomButton btntype="button" changeClass="me-4 btn btn-1 btn-outline" ClickEvent={handleAddCategory} iconName="fa-solid fa-check" btnName="Save " isBtn small={false} />
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