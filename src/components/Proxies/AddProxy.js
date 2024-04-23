import React, { useEffect, useState } from 'react';
import { createproxies } from '../../services/Proxy.service';
import { toastError, toastSuccess } from '../../utils/toastUtils';
import CustomButton from '../Utility/Button';

export default function AddProxy({ makeChange }) {
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
            let { data: res } = await createproxies(obj);
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
                <div className={makeChange ? "col-12 col-md-6" : "col-12"}>
                    <label className="blue-1 fs-12">
                        Value <span className="red">*</span>
                    </label>
                    <input value={value} onChange={(event) => setValue(event.target.value)} type="text" className="form-control" />
                </div>


                <div className="col-12">
                    <CustomButton btntype="button" ClickEvent={handleAdd} changeClass="me-4 btn btn-1 " iconName="fa-solid fa-check" btnName="Save" isBtn small={makeChange ? true : false} />
                </div>
            </form>
        </div>
    );
}
