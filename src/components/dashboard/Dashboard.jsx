import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { DashboardBox, DashboardChart, DashboardTable } from "../Utility/DashboardBox";

function Dashboard() {

  const dispatch = useDispatch();

  const [totalCompany, setTotalCompany] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalLeads, setTotalLeads] = useState(0)
  const [conversionObj, setConversionObj] = useState({});
  const [countryArr, setCountryArr] = useState([]);
  const [countryProducts, setCountryProducts] = useState([]);
  const [languageProducts, setlanguageProducts] = useState([]);
  const [productLeads, setProductLeads] = useState([]);
  const [marketsServed, setMarketsServed] = useState([]);
  const [farmType, setfarmType] = useState([]);
  const [farmSize, setfarmSize] = useState([]);
  const [customerProdcuts, setcustomerProdcuts] = useState([]);
  const [marketsServedProducts, setMarketsProducts] = useState([]);

  const [languageArr, setLanguageArr] = useState([]);
  const [leadList, setLeadList] = useState([]);

  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        color: "#757474"
      },
    },
  };




  // useEffect(() => {
  //   if (dashbaordReduxObj) {
  //     setTotalProducts(dashbaordReduxObj?.totalProducts)
  //     setTotalCompany(dashbaordReduxObj?.totalCompany)
  //     setTotalLeads(dashbaordReduxObj?.totalLead)
  //     setCountryProducts(dashbaordReduxObj?.countryProducts?.filter(el => el.count > 0))
  //     setlanguageProducts(dashbaordReduxObj?.languageProducts?.filter(el => el.count > 0))
  //     setMarketsProducts(dashbaordReduxObj?.marketsServedProducts?.filter(el => el.count > 0))
  //     setLeadList(dashbaordReduxObj?.leadArr)
  //     setProductLeads(dashbaordReduxObj?.producArr?.filter(el => el.leadCount > 0))
  //     setfarmSize(dashbaordReduxObj?.farmSizeProducts?.filter(el => el.count > 0))
  //     setcustomerProdcuts(dashbaordReduxObj?.customerProducts?.filter(el => el.count > 0))
  //     setfarmType(dashbaordReduxObj?.farmTypeProducts?.filter(el => el.count > 0))
  //   }

  // }, [dashbaordReduxObj]);


  const product_columns = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row?.value,
    },
    {
      name: "Total Products ",
      selector: (row) => row?.count,
    },
  ];

  const product_data = [
    {
      sl: "1",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
    {
      sl: "2",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
    {
      sl: "3",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
    {
      sl: "4",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
    {
      sl: "5",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
    {
      sl: "6",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
    {
      sl: "7",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
    {
      sl: "8",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
    {
      sl: "9",
      name: "EYELINER SUPER BLACK",
      brand: "",
      sale: "0",
    },
  ];
  const quality_columns = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "15%"
    },
    {
      name: "Name",
      selector: (row) => row.value,
    },
    {
      name: "No Of Products",
      selector: (row) => row.count,
      width: "25%"
    },
  ];

  const quality_data = [
    {
      sl: "1",
      category: "EYELINER SUPER BLACK",
      quantity: "0",
      sortable: true,
    },
    {
      sl: "2",
      category: "EYELINER SUPER BLACK",
      quantity: "0",
      sortable: true,
    },
    {
      sl: "3",
      category: "EYELINER SUPER BLACK",
      quantity: "0",
      sortable: true,
    },
    {
      sl: "4",
      category: "EYELINER SUPER BLACK",
      quantity: "0",
      sortable: true,
    },
    {
      sl: "5",
      category: "EYELINER SUPER BLACK",
      quantity: "0",
      sortable: true,
    },
  ];
  const leads_columns = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "12%"
    },
    {
      name: "Name",
      selector: (row, index) => row?.name ? row?.name : "NA",
      width: "20%"
    },
    {
      name: "Email",
      selector: (row, index) => row?.email ? row?.email : "NA",
    },
    {
      name: "Phone",
      selector: (row, index) => row?.phone ? row?.phone : "NA",
      width: "15%"
    },
  ];

  const product_sale_data = [
    {
      sl: "1",
      category: "Nails",
      quantity: "0",
    },
    {
      sl: "2",
      category: "Eyes",
      quantity: "0",
    },
    {
      sl: "3",
      category: "Face",
      quantity: "0",
    },
    {
      sl: "4",
      category: "Lips",
      quantity: "0",
    },
    {
      sl: "5",
      category: "Nail polish",
      quantity: "0",
    },
    {
      sl: "6",
      category: "Perfect Finish box(Nail P...",
      quantity: "0",
    },
    {
      sl: "7",
      category: "Foundation",
      quantity: "0",
    },
    {
      sl: "8",
      category: "LIQUID SINDOOR",
      quantity: "0",
    },
    {
      sl: "9",
      category: "BEAUTY POP BOX LIP COLOR",
      quantity: "0",
    },
    {
      sl: "10",
      category: "LIPSTIC A & B",
      quantity: "0",
    },
  ];

  const coupon_sale_columns = [
    {
      name: "SL",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "No of leads",
      selector: (row) => row.leadCount,
    },
  ];

  const coupon_sale_data = ["No data available in table"];

  const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];


  ChartJS.register(ArcElement, CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend);
  const productChartData = {
    labels: marketsServedProducts?.map(el => el.value),
    datasets: [
      {
        label: "Products",
        data: marketsServedProducts?.map(el => el.count),
        backgroundColor: colorArray,
        borderColor: ["#eee"],
        borderWidth: 1,
      },
    ],
  };

  const FarmTypeChartData = {
    labels: farmType?.map(el => el.value),
    datasets: [
      {
        label: "Products",
        data: farmType?.map(el => el.count),
        backgroundColor: colorArray,
        borderColor: ["#eee"],
        borderWidth: 1,
      },
    ],
  };

  const FarmSizeChartData = {
    labels: farmSize?.map(el => el.value),
    datasets: [
      {
        label: "Products",
        data: farmSize?.map(el => el.count),
        backgroundColor: colorArray,
        borderColor: ["#eee"],
        borderWidth: 1,
      },
    ],
  };
  const CustomerrSizeChartData = {
    labels: customerProdcuts?.map(el => el.value),
    datasets: [
      {
        label: "Products",
        data: customerProdcuts?.map(el => el.count),
        backgroundColor: colorArray,
        borderColor: ["#eee"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <main >
      <section className="dashboard-head mb-5">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <h5 className="blue-1 mb-0">Summary</h5>
          {/* <ul className="dashboard-filter filters">
            {filter.map((item, i) => {
              return (
                <li key={`${item.type}_${i}`}>
                  <CustomButton
                    navPills
                    btnName={item.name}
                    changeClass="filtering"
                    pillActive={item.active ? true : false}
                    data-type={item.type}
                    ClickEvent={() => tabClick(i, filter, setfilter)}
                  />
                </li>
              );
            })}
          </ul> */}
        </div>
      </section>

      <section className="mb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-3" >
              <DashboardBox className="dashboard-summary">

                <h5 className="blue-1">No. Of Products Published</h5>
                <h4 className="text-dark mb-0">{totalProducts}</h4>
              </DashboardBox>
            </div>
            <div className="col-12 col-lg-3" >
              <DashboardBox className="dashboard-summary">

                <h5 className="blue-1">No. Of Companies</h5>
                <h4 className="text-dark mb-0">{totalCompany}</h4>
              </DashboardBox>
            </div>
            <div className="col-12 col-lg-3" >
              <DashboardBox className="dashboard-summary">

                <h5 className="blue-1">No. Of Leads</h5>
                <h4 className="text-dark mb-0">{totalLeads}</h4>
              </DashboardBox>
            </div>
            {/* {dashboardBox.map((item, i) => {
              return (
                <div className="col-12 col-lg-3" key={i}>
                  <DashboardBox className="dashboard-summary">
                    <h5 className="blue-1">{item.heading}</h5>
                    <h4 className="text-dark mb-0">{item.today}</h4>
                  </DashboardBox>
                </div>
              );
            })} */}
          </div>
        </div>
      </section>
      <section>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-8 mb-5">
              <DashboardChart>
                <h5 className="blue-1 mb-4">Region Products</h5>
                <Bar data={productChartData} options={{ responsive: true, }} />
              </DashboardChart>
            </div>

            <div className="col-12 col-md-4 mb-5">
              <DashboardChart>
                <h5 className="blue-1 mb-4">Farm Size Products</h5>
                <Doughnut data={FarmSizeChartData} options={{ responsive: true, }} />
              </DashboardChart>
            </div>
            <div className="col-12 col-md-8 mb-5">
              <DashboardChart>
                <h5 className="blue-1 mb-4">Farm Type Products</h5>
                <Bar data={FarmTypeChartData} options={{ responsive: true, }} />
              </DashboardChart>
            </div>
            <div className="col-12 col-md-4 mb-5">
              <DashboardChart>
                <h5 className="blue-1 mb-4">User Type Products</h5>
                <Doughnut data={CustomerrSizeChartData} options={{ responsive: true, }} />
              </DashboardChart>
            </div>


          </div>
        </div>
      </section>


      <section>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-6 mb-5">
              <DashboardTable>
                <h5 className="blue-1 mb-4">No Of Products/Countries</h5>
                <DataTable customStyles={customStyles} columns={product_columns} data={countryProducts} pagination />
              </DashboardTable>
            </div>
            <div className="col-12 col-md-6 mb-5">
              <DashboardTable>
                <h5 className="blue-1 mb-4">No Of Products/Language</h5>
                <DataTable customStyles={customStyles} columns={quality_columns} data={languageProducts} pagination />
                {/* <div className="text-center mt-4 mb-2">
                  <CustomButton
                    isLink
                    noIcon
                    btnName="SEE ALL"
                    path="/"
                    small
                    roundedPill
                  />
                </div> */}
              </DashboardTable>
            </div>
            <div className="col-12 col-md-6 mb-5">
              <DashboardTable>
                <h5 className="blue-1 mb-4">Leads</h5>
                <DataTable
                  customStyles={customStyles}
                  columns={leads_columns}
                  data={leadList}
                  pagination
                />

              </DashboardTable>
            </div>
            <div className="col-12 col-md-6 mb-5">
              <DashboardTable>
                <h5 className="blue-1 mb-4">Product Wise Lead</h5>
                <DataTable customStyles={customStyles}
                  columns={coupon_sale_columns}
                  data={productLeads}
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

export default Dashboard;
