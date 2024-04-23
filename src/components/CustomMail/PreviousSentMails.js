import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getcustomemail } from "../../services/CustomMail.service";
import { DisplayDate } from "../../utils/DateUtils";
import { DashboardTable } from "../Utility/DashboardBox";
import { toastError } from "../Utility/ToastUtils";

export default function PreviousSentMails() {
  const [mailArr, setMailArr] = useState([]);

  const handleGetMails = async () => {
    try {
      let { data: res } = await getcustomemail();
      if (res.data) {
        setMailArr(res.data);
      }
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    handleGetMails();
  }, []);


  const category_columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "5%"
    },
    {
      name: "Email",
      selector: (row) => row.email.split(",").map((ele, indexX) => {
        return <p key={indexX}>{ele}</p>;
      }),
      width: "30%"
    },
    {
      name: "Subject",
      selector: (row) => row?.subject,
    },
    {
      name: "Message",
      selector: (row) => row?.content,
    },
    {
      name: "Date",
      selector: (row) => DisplayDate(row.createdAt, "dd/mm/yyyy"),
      width: "8%"
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        color: "#757474"
      },
    },
  };

  return (
    <main className="mainbody_padding">
      <section className="product-category">
        <div class="container-fluid">
          <div class="row">
            <div class="breadcumarea">
              <h4>Previously Sent Mails</h4>
              <div class="breadcum">
                <ul>
                  <li>Previously Sent Mails</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-md-12">
              {/* <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="blue-1 m-0">Clients List</h5>
              </div> */}
              <DashboardTable>
                <DataTable customStyles={customStyles} columns={category_columns} data={mailArr && mailArr.length > 0 ? mailArr : []} pagination />

                {/* <table class="table table-striped">
                  <thead>
                    <tr>
                      <th
                        style={{
                          paddingLeft: "8px", // override the cell padding for head cells
                          color: "#000",
                          fontWeight: "500",
                        }}
                        scope="col"
                      >
                        #
                      </th>
                      <th
                        style={{
                          paddingLeft: "8px", // override the cell padding for head cells
                          color: "#000",
                          fontWeight: "500",
                        }}
                        scope="col"
                      >
                        Emails
                      </th>
                      <th
                        style={{
                          paddingLeft: "8px", // override the cell padding for head cells
                          color: "#000",
                          fontWeight: "500",
                        }}
                        scope="col"
                      >
                        Subject
                      </th>
                      <th
                        style={{
                          paddingLeft: "8px", // override the cell padding for head cells
                          color: "#000",
                          fontWeight: "500",
                        }}
                        scope="col"
                      >
                        Message
                      </th>
                      <th
                        style={{
                          paddingLeft: "8px", // override the cell padding for head cells
                          color: "#000",
                          fontWeight: "500",
                        }}
                        scope="col"
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mailArr &&
                      mailArr.length > 0 &&
                      mailArr.map((el, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              {el.email.split(",").map((ele, indexX) => {
                                return <p key={indexX}>{ele}</p>;
                              })}
                            </td>
                            <td>{el.subject}</td>
                            <td>{el.content}</td>
                            <td>{DisplayDate(el.createdAt, "dd/mm/yyyy")}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table> */}
              </DashboardTable>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
