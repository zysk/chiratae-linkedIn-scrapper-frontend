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

export default function Profile({ selectedUser, setSelectedUser, setChange }) {
    const user = useSelector((state) => state.auth.user);

    const [name, setName] = useState("");

    const [mailHost, setMailHost] = useState("");
    const [mailPort, setMailPort] = useState("");
    const [mailUserName, setMailUserName] = useState("");
    const [mailUserPassword, setMailUserPassword] = useState("");
    const [mailEncryption, setMailEncryption] = useState("");
    const [mailService, setMailService] = useState("");

    const handleGet = async () => {
        try {
            let { data: res } = await getById(user?._id);
            if (res.success) {
                setMailHost(res?.data?.mailSettingsObj?.mailHost)
                setMailPort(res?.data?.mailSettingsObj?.mailPort)
                setMailUserName(res?.data?.mailSettingsObj?.mailUserName)
                setMailUserPassword(res?.data?.mailSettingsObj?.mailUserPassword)
                setMailEncryption(res?.data?.mailSettingsObj?.mailEncryption)
                setMailService(res?.data?.mailSettingsObj?.mailService)
            }
        }
        catch (err) {
            toastError(err);
        }
    };


    useEffect(() => {
        handleGet()
    }, [])


    const handleAdd = async () => {
        try {
            if (mailHost == "") {
                toastError("Mail Host Field cannot be empty!");
                return;
            }
            if (mailPort == "") {
                toastError("Mail Port Field cannot be empty!");
                return;
            }
            if (mailUserName == "") {
                toastError("Mail User Name Field cannot be empty!");
                return;
            }
            if (mailUserPassword == "") {
                toastError("Mail User Password Field cannot be empty!");
                return;
            }
            if (mailEncryption == "") {
                toastError("Mail Encryption Field cannot be empty!");
                return;
            }

            let obj = {
                mailSettingsObj: {
                    mailHost,
                    mailPort,
                    mailUserName,
                    mailUserPassword,
                    mailEncryption,
                    mailService
                }
            };
            let { data: res } = await updateUser(
              {
                ...obj,
                mailUserPassword:
                  Buffer.from(mailUserPassword).toString("base64"),
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
                                <form action="#" className="form row">
                                    <div className={"col-6"}>
                                        <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Mail Host" value={mailHost} onChange={(event) => setMailHost(event.target.value)} type="text" className="form-control" />
                                    </div>
                                    <div className={"col-6"}>
                                        <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Mail Port" value={mailPort} onChange={(event) => setMailPort(event.target.value)} type="text" className="form-control" />
                                    </div>
                                    <div className={"col-6"}>
                                        <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label=" Mail User Name" value={mailUserName} onChange={(event) => setMailUserName(event.target.value)} type="text" className="form-control" />
                                    </div>
                                    <div className={"col-6"}>
                                        <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label=" Mail Password" value={mailUserPassword} onChange={(event) => setMailUserPassword(event.target.value)} type="password" className="form-control" />
                                    </div>
                                    <div className={"col-6"}>
                                        <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label=" Mail Service" value={mailService} onChange={(event) => setMailService(event.target.value)} type="text" className="form-control" />
                                    </div>
                                    <div className={"col-6"}>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Mail Encryption</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={mailEncryption}
                                                    label="Mail Encryption"
                                                    onChange={e => setMailEncryption(e.target.value)}
                                                >
                                                    <MenuItem value='SSL'>SSL</MenuItem>
                                                    <MenuItem value='TLS'>TLS</MenuItem>

                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </div>
                                    <div className='row'>
                                        <div className="col-12 text-end">
                                            <CustomButton btntype="button" changeClass="me-4 btn btn-1 btn-outline" ClickEvent={handleAdd} iconName="fa-solid fa-check" btnName="Save " isBtn small={false} />
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