import React, { useEffect } from "react";
import { images } from "../Images/Images";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
function SideBar() {
  let location = useLocation();
  let role = useSelector((state) => state.auth.role);
  const sideBarOpen = useSelector((state) => state.auth.sideBarOpen);
  const [activeTab, setActiveTab] = useState("");
  const [activeTabChild, setActiveChildTab] = useState("");
  const [sidebar_item, setsidebar_item] = useState([
    // {
    //   isrotated: true,
    //   active: true,
    //   name: "dashboard",
    //   path: "/Dashboard",
    //   icon: "ion-grid",
    //   children: [],
    // },<i class="fa-solid fa-gauge"></i>
    {
      isrotated: false,
      active: false,
      name: "Campaign",
      icon: "fa-solid fa-gauge",
      roleArr: ["ADMIN"],
      children: [
        {
          name: "New Campaign",
          path: "/Campaign",
          icon: "fa-solid fa-binoculars",
          roleArr: ["ADMIN"],
          active: false,
        },
        {
          name: "Past Campaign",
          path: "/Past-Campaign",
          icon: "fa-solid fa-binoculars",
          roleArr: ["ADMIN"],
          active: false,
        },
      ],
    },
    {
      isrotated: false,
      active: false,
      name: "My Leads",
      icon: "fa-solid fa-user",
      roleArr: ["USER"],
      path: "/My-Leads",
      children: [],
    },
    {
      isrotated: false,
      active: false,
      name: "All Leads",
      icon: "fa-sharp fa-solid fa-file-lines",
      roleArr: ["ADMIN"],
      path: "/All-Leads",
      children: [],
    },
    {
      isrotated: false,
      active: false,
      name: "Sub-users",
      icon: "fa-solid fa-user",
      roleArr: ["ADMIN"],
      path: "/Users",
      children: [],
    },
    {
      isrotated: false,
      active: false,
      name: "Previously Sent Mails",
      icon: "fa-solid fa-envelope-circle-check",
      roleArr: ["ADMIN"],
      path: "/PreviousSentMails",
      children: [],
    },
    {
      isrotated: false,
      active: false,
      name: "Send Custom Mail",
      icon: "fa-solid fa-envelope",
      roleArr: ["ADMIN"],
      path: "/SendCustomMail",
      children: [],
    },
    {
      isrotated: false,
      active: false,
      name: "My Email Settings",
      icon: "fa-solid fa-envelope",
      roleArr: ["ADMIN", "USER"],
      path: "/Email-Settings",
      children: [],
    },
    {
      isrotated: false,
      active: false,
      name: "Settings",
      icon: "fa-solid fa-gear",
      roleArr: ["ADMIN"],
      children: [
        {
          name: "LinkedIn login",
          path: "/LinkedInAccounts",
          icon: "fa-solid fa-binoculars",
          roleArr: ["ADMIN"],
          active: false,
        },
        {
          name: "Email Settings",
          path: "/EmailSettings",
          icon: "fa-solid fa-binoculars",
          roleArr: ["ADMIN"],
          active: false,
        },
        // {
        //   name: "Proxy settings",
        //   path: "/Proxies",
        //   roleArr: ["ADMIN"],
        //   active: false,
        // },
        {
          name: "Lead Status",
          path: "/Lead-Status",
          roleArr: ["ADMIN"],
          icon: "fa-solid fa-binoculars",
          active: false,
        },
      ],
    },

    // {<i class="fa-solid fa-magnifying-glass"></i>
    //   isrotated: false,
    //   active: false,
    //   name: "products",
    //   path: "/Dashboard",
    //   icon: "fa-brands fa-product-hunt",
    //   children: [
    //     {
    //       name: "Add New Product",
    //       path: "/Product/AddProduct",
    //       active: false,
    //     },
    //     {

    //       name: "All Product",
    //       path: "/Product/Product-list",
    //       active: false,

    //     },
    //   ],
    // },
    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Language",
    //   path: "/Language/View",
    //   icon: "fa-brands fa-product-hunt",
    //   children: [],
    // },
    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Translation",
    //   path: "/Language",
    //   icon: "fa-brands fa-product-hunt",
    //   children: [
    //     {
    //       name: "General Translations",
    //       path: "/Language/Translation",
    //       active: false,
    //     },
    //     {
    //       name: "About Page Translations",
    //       path: "Language/AboutPageTranslation",
    //       active: false,
    //     },
    //     {
    //       name: "Partner Page Translations",
    //       path: "/Language/PartnerPageTranslation",
    //       active: false,
    //     },
    //     {
    //       name: "Home Page Translations",
    //       path: "/Language/HomePageTranslation",
    //       active: false,
    //     },
    //     {
    //       name: "Category Page Translations",
    //       path: "/Language/CategoryPageTranslation",
    //       active: false,
    //     },
    //     {
    //       name: "Product Page Translations",
    //       path: "/Language/ProductPageTranslation",
    //       active: false,
    //     },
    //     {
    //       name: "Header Footer Translations",
    //       path: "/Language/HeaderFooterTranslation",
    //       active: false,
    //     },
    //   ],
    // },
    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Contact Enquiry",
    //   path: "/Contact/View",
    //   icon: "fa-brands fa-product-hunt",
    //   children: [],
    // },
    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Partner Enquiry",
    //   path: "/Partner-enquiry/View",
    //   icon: "fa-brands fa-product-hunt",
    //   children: [],
    // },
    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Leads",
    //   path: "/Leads/View",
    //   icon: "fa-brands fa-product-hunt",
    //   children: [],
    // },
    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Homepage Banner",
    //   path: "/HomepageBanner/View",
    //   icon: "fa-brands fa-product-hunt",
    //   children: [],
    // },

    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Customer",
    //   path: "/Dashboard",
    //   icon: "fa-solid fa-users",
    //   children: [
    //     {
    //       name: "View Customer Categories",
    //       path: "/Customer-Category",
    //       active: false,
    //     },
    //     {
    //       name: "All Customer",
    //       path: "/Customer-list",
    //       active: false,
    //     },
    //   ],
    // },
    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Customer Orders",
    //   path: "/User-Order/View-All",
    //   icon: "fa-solid fa-users",
    //   children: [],
    // },
    // {
    //   isrotated: false,
    //   active: false,
    //   name: "Sub Admins",
    //   path: "/",
    //   icon: "fa-solid fa-users",
    //   children: [],
    // },
  ]);

  useEffect(() => {
    const path = location.pathname;
    console.log(path);
    try {
      sidebar_item.map((element, index) => {
        if (element.children.length > 0) {
          element.children.map((child, childIndex) => {
            if (child.path === path) {
              setActiveChildTab(child.name);
              setActiveTab(element.name);
            }
          });
        }
        if (element.path === path) {
          setActiveTab(element.name);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, [location]);

  const isRotating = (i) => {
    if (sidebar_item[i].children.length === 0)
      setActiveTab(sidebar_item[i].name);
    else {
      let temp_array = sidebar_item.map((el, index) => {
        if (index === i) {
          el.isrotated = !el.isrotated;
        } else el.isrotated = false;
        return el;
      });
      setsidebar_item([...temp_array]);
    }
  };

  const childActive = (i, parentIndex) => {
    setActiveTab(sidebar_item[parentIndex].name);
    setActiveChildTab(sidebar_item[parentIndex]["children"][i].name);
  };

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <div id="sidebar">
      <div className={sideBarOpen ? "main-logo" : "main-logo-reverse"}>
        {/* <h1><b>LOGO</b></h1> */}
        {/* <img src={images.logo} alt="" /> */}
      </div>
      <ul className="sidebar-menu" id="sidebarMenu">
        {sidebar_item.map((item, i) => {
          if (
            typeof array === "undefined" &&
            item.children.length === 0 &&
            item?.roleArr.some(
              (el) => `${el}`.toLowerCase() == `${role}`.toLowerCase()
            )
          ) {
            return (
              <li key={`sidebar_item_${i}`}>
                <Link
                  to={item.path}
                  className={
                    item.active || activeTab === item["name"] ? "active" : ""
                  }
                  onClick={() => isRotating(i)}
                >
                  <i className={item.icon}></i>
                  {sideBarOpen && <p className="mb-0">{item.name}</p>}
                </Link>
              </li>
            );
          } else {
            if (
              item?.roleArr &&
              item?.roleArr?.length > 0 &&
              item?.roleArr.some(
                (el) => `${el}`.toLowerCase() == `${role}`.toLowerCase()
              )
            ) {
              return (
                <li key={`sidebar_item_${i}`}>
                  <Link
                    to={`#sidebar_item_children_${i}`}
                    // className={
                    //   item.active || location.pathname === item.path ? "active collapsed" : "collapsed"
                    // }
                    className={
                      activeTab === item["name"]
                        ? "active collapsed"
                        : "collapsed"
                    }
                    data-bs-toggle="collapse"
                    aria-expanded={`${item.isrotated}`}
                    aria-controls={`sidebar_item_children_${i}`}
                    role="button"
                    onClick={() => isRotating(i)}
                  >
                    <i className={item.icon}></i>
                    {sideBarOpen && (
                      <p className="mb-0">
                        {item.name}
                        {item.isrotated ? (
                          <i className="fa fa-chevron-up pe-3"></i>
                        ) : (
                          <i className="fa fa-chevron-down pe-3"></i>
                        )}
                      </p>
                    )}
                  </Link>

                  <ul
                    className={sideBarOpen ? "collapse" : "collapse"}
                    id={`sidebar_item_children_${i}`}
                    data-bs-parent="#sidebarMenu"
                  >
                    {item.children.map((child, index) => {
                      if (sideBarOpen) {
                        return (
                          <li key={`${child.name}_${index}`}>
                            <Link
                              to={child.path}
                              // className={
                              //   location.pathname === child.path
                              //     ? "active"
                              //     : ""
                              // }
                              className={
                                activeTabChild === child.name &&
                                activeTab === item["name"]
                                  ? "active"
                                  : ""
                              }
                              onClick={() => childActive(index, i)}
                            >
                              {sideBarOpen ? (
                                <span>{child.name}</span>
                              ) : (
                                <i className={item.icon}></i>
                              )}
                            </Link>
                          </li>
                        );
                      } else {
                        return (
                          <div key={`${child.name}_${index}`}>
                            <Link
                              to={child.path}
                              className={
                                activeTabChild === child.name &&
                                activeTab === item["name"]
                                  ? "active"
                                  : ""
                              }
                              // className={
                              //   location.pathname === child.path
                              //     ? "active"
                              //     : ""
                              // }
                              onClick={() => childActive(index, i)}
                            >
                              <i className={child?.icon}></i>
                            </Link>
                          </div>
                        );
                      }
                    })}
                  </ul>
                </li>
              );
            }
          }
        })}
      </ul>
    </div>
  );
}

export default SideBar;
