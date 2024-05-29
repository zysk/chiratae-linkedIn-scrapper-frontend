import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { addcustomemail } from '../../services/CustomMail.service';
import { getUser } from '../../services/users.service';
import CustomButton from '../Utility/Button';
import { DashboardTable } from '../Utility/DashboardBox';
import { toastError, toastSuccess } from '../Utility/ToastUtils';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function SendCustomMail() {
  const [usersArr, setUsersArr] = useState([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [personName, setPersonName] = React.useState([]);
  const theme = useTheme();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleAdd = async () => {
    try {
      if (subject === '') {
        toastError('Subject Field cannot be empty!');
        return;
      } else if (content === '') {
        toastError('Content Field cannot be empty!');
        return;
      } else if (email === '' && personName.length === 0) {
        toastError('Email Field cannot be empty!');
        return;
      }

      let tempEmail = `${email}${
        selectedUsers && selectedUsers.length > 0
          ? selectedUsers.reduce(
              (acc, el, index) =>
                acc +
                `${el.value}${index == selectedUsers.length - 1 ? '' : ','}`,
              ','
            )
          : ''
      }`
        .split(',')
        .filter((el) => el && el != '' && el != false)
        .join(',');

      // console.log(tempEmail, '1as');

      let obj = {
        subject,
        content,
        email: email === '' ? personName : email,
      };
      let { data: res } = await addcustomemail(obj);
      if (res.success) {
        toastSuccess(res.message);
      }

      // handleClearState()
    } catch (err) {
      toastError(err);
    }
  };

  const handleGetUsers = async () => {
    try {
      let { data: res } = await getUser('role=USER');
      if (res.data) {
        setUsersArr(
          res.data
            .filter((el) => el.email && el.email != '')
            .map((el) => ({
              label: `${el.email} |  ${el.name}`,
              value: el.email,
            }))
        );
      }
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  const handleChange = (event) => {
    setEmail('');
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <main>
      <section className='product-category'>
        <div class='container-fluid'>
          <div class='row'>
            <div class='breadcumarea'>
              <h4>Send Custom Mail</h4>
              <div class='breadcum'>
                <ul>
                  <li>Send Custom Mail</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid p-0'>
          <div className='row'>
            <div className='col-12 col-md-12'>
              {/* <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="blue-1 m-0">Clients List</h5>
              </div> */}
              <DashboardTable>
                <div className={'makeChange mt-3'}>
                  <form className='form row'>
                    <div className={'col-12'}>
                      {/* <label className="blue-1 fs-12">
                                                 <span className="red">*</span>
                                            </label> */}
                      <TextField
                        sx={{ borderRadius: 5 }}
                        id='outlined-basic'
                        label='Email (to send to multiple accounts please seperate individual emails with a coma for example a@a.com,b@b.com etc)'
                        value={email}
                        onChange={(event) => {
                          const {
                            target: { value },
                          } = event;
                          setEmail(
                            // On autofill we get a stringified value.
                            typeof value === 'string' ? value.split(',') : value
                          );
                          setPersonName([]);
                        }}
                        type='email'
                        className='form-control mb-3'
                      />
                      {/* <label className="blue-1 fs-12">
                                                Or select from users
                                            </label> */}
                      {/* <ReactSelect isMulti onChange={(e) => setSelectedUsers(e)} value={selectedUsers} closeMenuOnSelect={false} options={usersArr} /> */}
                      <Box sx={{ minWidth: 120 }}>
                        <div>
                          <FormControl fullWidth>
                            <InputLabel id='demo-multiple-name-label'>
                              Or select from users
                            </InputLabel>
                            <Select
                              labelId='demo-multiple-name-label'
                              id='demo-multiple-name'
                              multiple
                              value={personName}
                              onChange={handleChange}
                              MenuProps={MenuProps}
                            >
                              {usersArr &&
                                usersArr.length > 0 &&
                                usersArr.map((el) => {
                                  return (
                                    <MenuItem
                                      key={el.value}
                                      value={el.value}
                                      style={getStyles(
                                        el.value,
                                        personName,
                                        theme
                                      )}
                                    >
                                      {el.label}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                        </div>
                      </Box>
                    </div>

                    <div className={'col-12'}>
                      {/* <label className="blue-1 fs-12">
                                                 <span className="red">*</span>
                                            </label> */}
                      <TextField
                        sx={{ borderRadius: 5 }}
                        id='outlined-basic'
                        label='Subject'
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                        type='email'
                        className='form-control'
                      />
                    </div>
                    <div className={'col-12'}>
                      <label className='blue-1 fs-12'>
                        Message <span className='red'>*</span>
                      </label>
                      <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        type='email'
                        className='form-control'
                      />
                    </div>
                    <div className='col-12 text-end'>
                      <CustomButton
                        btntype='button'
                        changeClass='me-4 btn btn-1  btn-outline mt-5'
                        ClickEvent={handleAdd}
                        iconName='fa-solid fa-check'
                        btnName='Save'
                        isBtn
                        small={false}
                      />
                    </div>
                  </form>
                </div>
              </DashboardTable>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
