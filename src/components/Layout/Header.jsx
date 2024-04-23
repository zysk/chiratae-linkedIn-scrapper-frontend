import { Badge } from "@mui/material";
import React, { useEffect } from "react";
import SearchBox from "../Utility/SearchBox";
import { images } from "../Images/Images";
import CustomButton from "../Utility/Button";

import { useSelector, useDispatch } from "react-redux";
import { logoutUser, toggleSideBarFromHeader } from "../../redux/actions/auth/auth.actions";
import { useLocation } from "react-router-dom";
function Header() {
  const dispatch = useDispatch();
  let location = useLocation()
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const sideBarOpen = useSelector((state) => state.auth.sideBarOpen);
  const handleLogout = () => {
    dispatch(logoutUser());
  };


  useEffect(() => {
    console.log(location, "location")
  }, [location])

  return (
    <header className="topbgcolor">
      <div className="header">
        <div className="d-flex align-items-center gap-4">
          <div className="collaspe_icon" onClick={() => dispatch(toggleSideBarFromHeader())}>
            <p className={sideBarOpen ? "cricle_arrow" : "cricle_arrow_left"}><i class='fas fa-arrow-left'></i>   </p>
            {/* <i className="ion-navicon-round blue-1"></i> */}
          </div>
          {/* <SearchBox extraClass="" /> */}
        </div>
        {/* <div className="link-to-website">
          <CustomButton isLink changeClass="btn btn-1" btnName="Website" noIcon />
        </div> */}
        <div className="d-flex align-items-center gap-5">
          {/* <div className="notification-bell position-relative">
            <Badge
              badgeContent={4}
              max={10}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <i className="ion-ios-bell text-black-50 fs-3"></i>
            </Badge>
            <div className="notification-box bg-white">
              <div className="py-4 px-3 bg-dark notification-box-header">
                <h5 className="text-white mb-0">Notifications</h5>
              </div>
              <div className="p-3 notification-box-content">
                <CustomButton isLink btnName="1. A product has been disabled." noIcon changeClass="fs-12 blue-1" />
              </div>
              <div className="p-3 notification-box-footer d-flex gap-3 justify-content-between">
                <CustomButton isLink btnName="SETTING" noIcon extraClass="fs-12 py-2" roundedPill />
                <CustomButton isLink btnName="READ ALL" noIcon extraClass="fs-12 py-2" roundedPill />
                <CustomButton isLink btnName="VIEW" noIcon extraClass="fs-12 py-2" roundedPill />
              </div>
            </div>
          </div> */}
          <div className="user-profile position-relative">
            <CustomButton isLink isLinkImg ImgSrc={images.avatar} path={location?.pathname} noIcon noClass imgClass="rounded-circle" />
            <div className="user-profile-box mt-3 end-0 py-4 px-3">
              <p className="fw-light mb-0">Welcome {user?.name ? user?.name : "SuperAdmin"} !</p>
              <p className="fw-600 mb-0">
                <CustomButton btntype="button" isLink btnName={role ? role == "USER" ? "SUB-USER" : role : "SuperAdmin"} path="/Email-Settings" noIcon noClass />
              </p>
              <ul className="mt-4 pt-4">
                {/* <li>
                  <CustomButton isLink btnName="My Profile" path="/Admin/Profile" iconName="ion-ios-person" noClass />
                </li> */}
                {/* <li>
                  <CustomButton isLink btnName="Company Info" path="/Company-Information" iconName="ion-ios-person" noClass />
                </li> */}
                <li>
                  <CustomButton isLink btnName="Settings" path="" iconName="ion-ios-gear" noClass />
                </li>
                <li>
                  <CustomButton ClickEvent={handleLogout} isLink btnName="Log out" path="/" iconName="ion-share" noClass />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
