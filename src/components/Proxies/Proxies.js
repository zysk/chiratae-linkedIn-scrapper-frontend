import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { deletelinkedInAccount, getlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { deleteproxies, getproxies } from '../../services/Proxy.service';
import ActionIcon from "../Utility/ActionIcon";
import CustomButton from '../Utility/Button';
import { DashboardBox, DashboardTable } from '../Utility/DashboardBox';
import { toastError, toastSuccess } from '../Utility/ToastUtils';
import AddProxy from './AddProxy';
export default function Proxies() {
    // ==============================================================================================================
    const [proxiesArr, setproxiesArr] = useState([]);
    const category_columns = [
        {
            name: "ID",
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: "Value",
            selector: (row) => row?.value,
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
                        deletePath="/Proxies"
                        remove
                        Uniquekey={row?.id}
                    />

                </>
            ),
        },
    ];



    const handleGet = async () => {
        try {

            let { data: res } = await getproxies();
            if (res.success) {
                setproxiesArr(res.data)
            }
        }
        catch (err) {
            toastError(err);
        }
        // dispatch(CATEGORYAdd(obj));
    };

    const handleDelete = async (id) => {
        try {

            let { data: res } = await deleteproxies(id);
            if (res.success) {
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
    }, [])

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
            <section className="product-category">
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="blue-1 m-0">Add Proxies</h5>
                            </div>
                            <DashboardBox>
                                <AddProxy />
                            </DashboardBox>
                        </div>
                        <div className="col-12 col-md-8">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h5 className="blue-1 m-0">Proxy List</h5>
                            </div>
                            <DashboardTable>
                                <DataTable customStyles={customStyles} columns={category_columns} data={proxiesArr && proxiesArr.length > 0 ? proxiesArr : []} pagination />
                            </DashboardTable>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

