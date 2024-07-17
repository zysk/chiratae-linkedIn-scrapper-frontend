import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 justify-center">
      {/* <div className="bg-primary-first h-8 w-8 rounded-full flex items-center justify-center"> */}
        <Image width={100} height={100} alt="logo" src="/images/logo.png" />
      {/* </div> */}
      {/* <h2 className="">Chiratae</h2> */}
    </Link>
  );
};

export default Logo;
