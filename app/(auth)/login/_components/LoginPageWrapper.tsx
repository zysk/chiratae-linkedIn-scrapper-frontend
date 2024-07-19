import React from "react";

const LoginPageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container max-w-7xl mx-auto w-[50%] h-[100vh] p-8 flex flex-col justify-between">
      {children}
    </div>
  );
};

export default LoginPageWrapper;
