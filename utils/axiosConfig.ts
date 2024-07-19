"use client";
import { useEffect } from "react";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

function AxiosConfig() {
  console.log("--- interception ---- ")
  useEffect(() => {
    axios.interceptors.request.use(async (request) => {
      const session = await getSession();
      // console.log("session", session);
      if (session)
        request.headers.Authorization = `Bearer ${session.access_token}`;
      return Promise.resolve(request);
    });

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error?.response?.status === 401) signOut({ callbackUrl: "/login" });
        return Promise.reject(error);
      }
    );
  }, []);

  return "";
}

export default AxiosConfig;
