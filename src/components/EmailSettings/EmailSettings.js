import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
export default function EmailSettings() {



    // ==============================================================================================================
    const [emailSettingsObj, setEmailSettingsObj] = useState([]);


    const [mailFromAddress, setMailFromAddress] = useState("");
    const [mailFromName, setMailFromName] = useState("");
    const [mailHost, setMailHost] = useState("");
    const [mailPort, setMailPort] = useState("");
    const [mailUserName, setMailUserName] = useState("");
    const [mailUserPassword, setMailUserPassword] = useState("");
    const [mailEncryption, setMailEncryption] = useState("");
    const [mailService, setMailService] = useState("");

    const [companyOptions, setCompanyOptions] = useState("");



    const handleGet = async () => {
        try {
            let { data: res } = await getEmailSettings();
            if (res.success) {
                setEmailSettingsObj(res.data)
                setMailFromAddress(res.data.mailFromAddress)
                setMailFromName(res.data.mailFromName)
                setMailHost(res.data.mailHost)
                setMailPort(res.data.mailPort)
                setMailUserName(res.data.mailUserName)
                setMailUserPassword(res.data.mailUserPassword)
                setMailEncryption(res.data.mailEncryption)
                setMailService(res.data.mailService)
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

    const handleAdd = async () => {
        try {

            // if (mailFromAddress == "") {
            //     toastError("Mail From Address Field cannot be empty!");
            //     return;
            // }
            // if (mailFromName == "") {
            //     toastError("Mail From Name Field cannot be empty!");
            //     return;
            // }
            // if (mailHost == "") {
            //     toastError("Mail Host Field cannot be empty!");
            //     return;
            // }
            // if (mailPort == "") {
            //     toastError("Mail Port Field cannot be empty!");
            //     return;
            // }
            // if (mailUserName == "") {
            //     toastError("Mail User Name Field cannot be empty!");
            //     return;
            // }
            // if (mailUserPassword == "") {
            //     toastError("Mail User Password Field cannot be empty!");
            //     return;
            // }
            // if (mailEncryption == "") {
            //     toastError("Mail Encryption Field cannot be empty!");
            //     return;
            // }

            let obj = {
                mailFromAddress,
                mailFromName,
                mailHost,
                mailPort,
                mailUserName,
                mailUserPassword,
                mailEncryption,
                mailService
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
                                    <form action="#" className="form row">
                                        {/* <div className={"col-6"}>

                                            <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label="Mail From Address" value={mailFromAddress} onChange={(event) => setMailFromAddress(event.target.value)} type="text" className="form-control" />
                                        </div>
                                        <div className={"col-6"}>

                                            <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label=" Mail From Name" value={mailFromName} onChange={(event) => setMailFromName(event.target.value)} type="text" className="form-control" />
                                        </div> */}
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

                                            <TextField sx={{ borderRadius: 5 }} id="outlined-basic" type="password" label=" Mail Password" value={mailUserPassword} onChange={(event) => setMailUserPassword(event.target.value)} className="form-control" />
                                        </div>
                                        <div className={"col-6"}>

                                            <TextField sx={{ borderRadius: 5 }} id="outlined-basic" label=" Mail Service" value={mailService} onChange={(event) => setMailService(event.target.value)} type="text" className="form-control" />
                                        </div>
                                        <div className={"col-6"}>
                                            {/* <label className="blue-1 fs-12">
                                                Mail Encryption <span className="red">*</span>
                                            </label> */}
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

                                            {/* <ReactSelect value={{ label: mailEncryption, value: mailEncryption }} onChange={(e) => setMailEncryption(e.value)} options={[{ label: "SSL", value: "SSL" }, { label: "TLS", value: "TLS" }]} /> */}

                                            {/* <input value={mailEncryption} onChange={(event) => setMailEncryption(event.target.value)} type="text" className="form-control" /> */}
                                        </div>


                                        <div className="col-12 text-end mt-2">
                                            <CustomButton btntype="button" ClickEvent={handleAdd} iconName="fa-solid fa-check" changeClass="me-4 btn btn-1 btn-outline" btnName="Save" isBtn small={true} />
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

