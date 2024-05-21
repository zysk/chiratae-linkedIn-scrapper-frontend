import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import {Buffer} from 'buffer';
import { createlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { toastError, toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';

export default function AddLinkedInAccount({ makeChange }) {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");


    const handleAddCategory = async () => {
        try {

            if (name == "") {
                toastError("LinkedIn Email Field cannot be empty!");
                return;
            }
            else if (password == "") {
                toastError("Password Field cannot be empty!");
                return;
            }

            let obj = {
                name,
                password: Buffer.from(password).toString("base64"),
            };
            let { data: res } = await createlinkedInAccount(obj);
            if (res.success) {
                toastSuccess(res.message);
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


    return (
        <div className={makeChange ? "makeChange" : ""}>
            <form action="#" className="form row">
                <div className={makeChange ? "col-6 col-md-6" : "col-6"}>
                    {/* <label className="blue-1 fs-12">
                         <span className="red">*</span>
                    </label> */}
                    <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Linked email" value={name} onChange={(event) => setName(event.target.value)} type="text" className="form-control" />
                </div>
                <div className={makeChange ? "col-6 col-md-6" : "col-6"}>
                    {/* <label className="blue-1 fs-12">
                        Password <span className="red">*</span>
                    </label> */}
                    <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="form-control" />
                </div>





                <div className="col-12 text-end mt-4">
                    <CustomButton btntype="button" ClickEvent={handleAddCategory} iconName="fa-solid fa-check" changeClass="me-4 btn btn-1 btn-outline" btnName="Save" isBtn small={makeChange ? true : false} />
                </div>
            </form>
        </div>
    );
}
