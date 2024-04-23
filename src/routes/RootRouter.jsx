import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthorizedRoutes from "./AuthorizedRoutes";
import UnauthorizedRoutes from "./UnauthorizedRoutes";


import { useSelector } from "react-redux";
export default function RootRouter() {
  const authObj = useSelector((state) => state.auth);
  return <Router>{authObj?.isAuthorized ? <AuthorizedRoutes /> : <UnauthorizedRoutes />}</Router>;
}