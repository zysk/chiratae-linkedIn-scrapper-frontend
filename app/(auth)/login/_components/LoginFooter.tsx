import React from "react";
import { HiOutlineMail } from "react-icons/hi";

export const LoginFooter = () => {
  return (
    <footer className="flex items-center justify-between text-[#FFFFFFDE] text-sm">
      <p>© Zenie</p>
      <span className="flex items-center gap-x-2">
        <HiOutlineMail size={14} />
        <p>help@zenie.com</p>
      </span>
    </footer>
  );
};
