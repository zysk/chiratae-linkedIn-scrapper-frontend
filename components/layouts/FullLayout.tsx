import React from "react";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import { navigationLinks } from "@/utils/data/NavigationLinks";

interface FullLayoutProps {
  children: React.ReactNode;
}

const FullLayout = ({ children }: FullLayoutProps) => {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default FullLayout;
