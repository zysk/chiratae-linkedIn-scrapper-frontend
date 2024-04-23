import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { deleteLeadStatus, getLeadStatus } from '../../services/LeadStatus.service';
import { deletelinkedInAccount, getlinkedInAccount } from '../../services/LinkedInAccounts.service';
import { deleteproxies, getproxies } from '../../services/Proxy.service';
import ActionIcon from "../Utility/ActionIcon";
import CustomButton from '../Utility/Button';
import { DashboardBox, DashboardTable } from '../Utility/DashboardBox';
import { toastError, toastSuccess } from '../Utility/ToastUtils';
import AddLeadStatus from './AddLeadStatus';
export default function LeadStatus() {
    // ==============================================================================================================
    const [leadStatusArr, setleadStatusArr] = useState([]);
    const [changeCount, setChangeCount] = useState(0);
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
                        deletePath="/Lead-Status"
                        remove
                        Uniquekey={row?.id}
                    />

                </>
            ),
        },
    ];



    const handleGet = async () => {
        try {
            let { data: res } = await getLeadStatus();
            if (res.success) {
                setleadStatusArr(res.data)
            }
        }
        catch (err) {
            toastError(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            let { data: res } = await deleteLeadStatus(id);
            if (res.success) {
                toastSuccess(res.message)
                handleGet()
            }
        }
        catch (err) {
            toastError(err);
        }
    };

    useEffect(() => {
        handleGet()
    }, [changeCount])

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
            <div class="container-fluid">
          <div class="row">
            <div class="breadcumarea">
              <h4>Lead Status</h4>
              <div class="breadcum">
                <ul>
                  <li>Settings</li>
                  <li class="active">Lead Status</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-12 col-md-12">
                            <DashboardBox>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 >Add Lead Status</h5>
                            </div>
                                <AddLeadStatus setChangeCount={setChangeCount} />
                            </DashboardBox>
                        </div>
                        <div className="col-12 col-md-12">
                            <DashboardTable>
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h5>Lead Status List</h5>
                            </div>
                                <DataTable customStyles={customStyles} columns={category_columns} data={leadStatusArr && leadStatusArr.length > 0 ? leadStatusArr : []} pagination />
                            </DashboardTable>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

