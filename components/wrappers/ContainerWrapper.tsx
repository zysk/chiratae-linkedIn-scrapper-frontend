import React from "react";

const ContainerWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-[1040px] mx-auto w-full pb-20 pt-5">{children}</div>;
};

export default ContainerWrapper;
