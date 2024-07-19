"use client";
import AuthLogin from "@/app/(auth)/login/_components/Login";
import Logo from "@/components/Logo";
import PageWrapper from "@/components/wrappers/PageWrapper";
import Image from "next/image";
import { LoginFooter } from "./_components/LoginFooter";
import LoginPageWrapper from "./_components/LoginPageWrapper";
import { useState } from "react";

const Login = () => {
  
  return (
    <PageWrapper>
      <main className="flex items-center h-full">
        <LoginPageWrapper>
          <Logo />
          <AuthLogin />
          <LoginFooter />
        </LoginPageWrapper>

        {/* <section className="w-[50%]">
          <Image
            src="/Section (1).png"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full border h-[100vh] object-cover"
            alt="Section"
          />
        </section> */}
      </main>
    </PageWrapper>
  );
};

export default Login;
