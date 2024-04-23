import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  deletelinkedInAccount,
  getlinkedInAccount,
} from "../../services/LinkedInAccounts.service";
import ActionIcon from "../Utility/ActionIcon";
import CustomButton from "../Utility/Button";
import { DashboardBox, DashboardTable } from "../Utility/DashboardBox";
import { toastError, toastSuccess } from "../Utility/ToastUtils";
import AddLinkedInAccount from "./AddLinkedInAccount";
export default function LinkedInAccounts() {
  // ==============================================================================================================
  const [categoryArr, setCategoryArr] = useState([]);
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
    // {
    //     name: "Password",
    //     selector: (row) => (row?.password ? row?.password : "NA"),
    // },
    {
      name: "Action",
      minWidth: "210px",
      maxWidth: "211px",
      cell: (row) => (
        <>
          <ActionIcon
            isRedirected={true}
            onDeleteClick={() => handleDelete(row._id)}
            deletePath="/LinkedInAccounts"
            remove
            Uniquekey={row?.id}
          />
        </>
      ),
    },
  ];

  const handleGet = async () => {
    try {
      let { data: res } = await getlinkedInAccount();
      if (res.success) {
        setCategoryArr(res.data);
      }
    } catch (err) {
      toastError(err);
    }
    // dispatch(CATEGORYAdd(obj));
  };

  const handleDelete = async (id) => {
    try {
      let { data: res } = await deletelinkedInAccount(id);
      if (res.success) {
        toastSuccess(res.message);
        handleGet();
      }
    } catch (err) {
      toastError(err);
    }
    // dispatch(CATEGORYAdd(obj));
  };

  useEffect(() => {
    handleGet();
  }, []);

  // ==============================================================================================================

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        color: "#757474",
      },
    },
  };
  return (
    <main>
      <section className="product-category">
        <div class="container-fluid">
          <div class="row">
            <div class="breadcumarea">
              <h4>LinkedIn Log In</h4>
              <div class="breadcum">
                <ul>
                  <li>Settings</li>
                  <li class="active">LinkedIn Log In</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-md-12">
              <DashboardBox>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="breadcumarea py-0">
                    <h5>Add LinkedIn account</h5>
                </div>
              </div>
                <AddLinkedInAccount />
              </DashboardBox>
            </div>
            <div className="col-12 col-md-12">
              <DashboardTable>
              <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="breadcumarea py-0">
                    <h5>LinkedIn accounts List</h5>
                </div>
              </div>
                <DataTable
                  customStyles={customStyles}
                  columns={category_columns}
                  data={
                    categoryArr && categoryArr.length > 0 ? categoryArr : []
                  }
                  pagination
                />
              </DashboardTable>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
