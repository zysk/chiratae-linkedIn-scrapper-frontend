import { useEffect, useMemo } from "react";
import { axiosApiInstance } from "../App";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/scss/main.css";
import Dashboard from "../components/dashboard/Dashboard";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import LinkedInAccounts from "../components/LinkedInAccounts/LinkedInAccounts";
import PastCampaigns from "../components/PastCampaigns/PastCampaigns";
import Proxies from "../components/Proxies/Proxies";
import AddCampaign from "../components/Campaign/AddCampaign";
import CampaignDetails from "../components/CampaignDetails/CampaignDetails";
import SideBar from "../components/Sidebar/SideBar";
import Users from "../components/Users/Users";
import { logoutUser } from "../redux/actions/auth/auth.actions";
import LeadStatus from "../components/LeadStatus/LeadStatus";
import AllLeads from "../components/Leads/AllLeads";
import UserLeads from "../components/Leads/UserLeads";
import UserDetails from "../components/Users/UserDetails";
import AllUsers from "../components/Users/AllUsers";
import ScheduleCampaignLogin from "../components/Campaign/ScheduleCampaignLogin";
import EmailSettings from "../components/EmailSettings/EmailSettings";
import SendCustomMail from "../components/CustomMail/SendCustomMail";
import PreviousSentMails from "../components/CustomMail/PreviousSentMails";
import Profile from "../components/Profile/Profile";
export default function AuthorizedRoutes() {
  let token = useSelector((state) => state.auth.token);
  const sideBarOpen = useSelector((state) => state.auth.sideBarOpen);
  const authObj = useSelector((state) => state.auth);

  useEffect(() => {
    let temptoken = undefined;
    // console.log(temptoken, )
    let localStorageValue = localStorage.getItem("persist:modernmart-root");
    if (
      localStorageValue &&
      JSON.parse(localStorageValue) &&
      JSON.parse(localStorageValue).auth &&
      JSON.parse(JSON.parse(localStorageValue)?.auth)?.token
    ) {
      temptoken = JSON.parse(JSON.parse(localStorageValue).auth).token;
    }
    axiosApiInstance.interceptors.request.use(
      async (config) => {
        // console.log(token)
        if (token) {
          config.headers["authorization"] = "Bearer " + temptoken;
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => {
        // console.log(error)
        Promise.reject(error);
      }
    );
    axiosApiInstance.interceptors.response.use(
      (res) => {
        // Add configurations here
        return res;
      },
      async (err) => {
        console.log("INterceptor error");

        await logoutUser();

        return Promise.reject(err);
      }
    );
  }, []);

  return (
    <section style={{ backgroundColor: "#f4f6f8" }}>
      <div className="row">
        <div
          className={sideBarOpen ? "sidebar-open" : "sidebar-closed"}
          style={{ contain: "content" }}
        >
          <SideBar />
        </div>
        <div
          className="col ps-0"
          style={{ height: "100vh", overflow: "hidden scroll" }}
        >
          <Header />
          <Routes>
            {/* <Route exact path="/" element={<AllUsers />}></Route> */}
            <Route exact path="/Dashboard" element={<Dashboard />}></Route>
            <Route exact path="/Campaign" element={<AddCampaign />}></Route>
            <Route
              exact
              path="/scheduleCampaignLogin"
              element={<ScheduleCampaignLogin />}
            ></Route>
            <Route exact path="/My-Leads" element={<UserLeads />}></Route>
            <Route
              exact
              path="/"
              element={
                <Navigate
                  to={authObj?.role === "ADMIN" ? "/All-Leads" : "/My-Leads"}
                  replace
                />
              }
            ></Route>
            <Route exact path="/All-leads" element={<AllLeads />}></Route>
            <Route
              exact
              path="/View-Campaign-Detail/:id"
              element={<CampaignDetails />}
            ></Route>
            <Route
              exact
              path="/Past-Campaign"
              element={<PastCampaigns />}
            ></Route>
            <Route exact path="/Lead-Status" element={<LeadStatus />}></Route>
            <Route
              exact
              path="/LinkedInAccounts"
              element={<LinkedInAccounts />}
            ></Route>
            <Route exact path="/Proxies" element={<Proxies />}></Route>
            <Route
              exact
              path="/EmailSettings"
              element={<EmailSettings />}
            ></Route>
            <Route
              exact
              path="/SendCustomMail"
              element={<SendCustomMail />}
            ></Route>
            <Route
              exact
              path="/PreviousSentMails"
              element={<PreviousSentMails />}
            ></Route>
            <Route exact path="/Users" element={<Users />}></Route>
            <Route exact path="/Email-Settings" element={<Profile />}></Route>
            <Route
              exact
              path="/User-details/:id"
              element={<UserDetails />}
            ></Route>
          </Routes>
          <Footer />
        </div>
      </div>
    </section>
  );
}
