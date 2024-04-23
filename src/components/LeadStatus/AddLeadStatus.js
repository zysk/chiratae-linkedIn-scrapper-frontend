import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CreateLeadStatus } from '../../services/LeadStatus.service';
import { createproxies } from '../../services/Proxy.service';
import { toastError, toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';

export default function AddLeadStatus({ makeChange, setChangeCount }) {
    const [value, setValue] = useState("");

    const handleAdd = async () => {
        try {

            if (value == "") {
                toastError("Value Field cannot be empty!");
                return;
            }

            let obj = {
                value,
            };
            let { data: res } = await CreateLeadStatus(obj);
            if (res.success) {
                toastSuccess(res.message);
                setChangeCount(prev => prev + 1)
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
                <div className={makeChange ? "col-12 col-md-6" : "col-12"}>
                    {/* <label className="blue-1 fs-12">
                         <span className="red">*</span>
                    </label> */}
                    <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Value" value={value} onChange={(event) => setValue(event.target.value)} type="text" className="form-control" />
                </div>


                <div className="col-12 text-end mt-5">
                    <CustomButton btntype="button" ClickEvent={handleAdd} iconName="fa-solid fa-check" changeClass="me-4 btn btn-1 btn-outline" btnName="Save" isBtn small={makeChange ? true : false} />
                </div>
            </form>
        </div>
    );
}
