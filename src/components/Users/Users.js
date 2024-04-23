import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { deletelinkedInAccount, getlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { deleteUser, getUser } from '../../services/users.service';
import ActionIcon from "../Utility/ActionIcon";
import CustomButton from '../Utility/Button';
import { DashboardBox, DashboardTable } from '../Utility/DashboardBox';
import { toastError, toastSuccess } from '../Utility/ToastUtils';
import AddUsers from './AddUsers';

export default function Users() {
    // ==============================================================================================================
    const [userArr, setUserArr] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [change, setChange] = useState(0);
    const category_columns = [
        {
            name: "ID",
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row?.name,
        },
        {
            name: "Email",
            selector: (row) => row?.email,
        },
        {
            name: "Employee Id",
            selector: (row) => row?.employeeId,
        },
        {
            name: "Phone",
            selector: (row) => (row?.phone ? row?.phone : "NA"),
        },
        {
            name: "Active status",
            selector: (row) => (row?.isActive ? "Active" : "In-Active"),
        },
        {
            name: "Action",
            minWidth: "210px",
            maxWidth: "211px",
            cell: (row) => (
                <>
                    <ActionIcon
                        isRedirected={true}
                        onDeleteClick={() => handleDelete(row._id)}
                        deletePath="/Users"
                        edit
                        editPath='/Users'
                        onEditClick={() => handleEdit(row)}
                        remove
                        Uniquekey={row?.id}
                    />
                </>
            ),
        },
    ];


    const handleGet = async () => {
        try {
            let { data: res } = await getUser("role=USER");
            if (res.success) {
                setUserArr(res.data)
            }
        }
        catch (err) {
            toastError(err);
        }
        // dispatch(CATEGORYAdd(obj));
    };

    const handleEdit = async (obj) => {
        setSelectedUser(obj)
    };

    const handleDelete = async (id) => {
        try {
            let { data: res } = await deleteUser(id);
            if (res.message) {
                toastSuccess(res.message)
                handleGet()
            }
        }
        catch (err) {
            toastError(err);
        }
        // dispatch(CATEGORYAdd(obj));
    };

    useEffect(() => {
        handleGet()
    }, [change])
    // ==============================================================================================================

    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                color: "#757474"
            },
        },
    };

    return (
        <main>
            <div className="container-fluid">
                <div className="row">
                    <div className="breadcumarea">
                        <h4>Sub-Users</h4>
                        <div className="breadcum">
                            <ul>
                                <li>Sub-Users</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <section className="product-category">
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-12 col-md-12">
                            <DashboardBox>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h5>{selectedUser && selectedUser.name ? "Update" : "Add"} SubUsers</h5>
                                </div>
                                <AddUsers selectedUser={selectedUser} setChange={setChange} setSelectedUser={setSelectedUser} />
                            </DashboardBox>
                        </div>
                        <div className="col-12 col-md-12">
                            <DashboardTable>
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <h5>SubUsers List</h5>
                                </div>
                                <DataTable customStyles={customStyles} columns={category_columns} data={userArr && userArr.length > 0 ? userArr : []} pagination />
                            </DashboardTable>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}