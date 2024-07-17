import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="bg-primary-first h-8 w-8 rounded-full flex items-center justify-center">
        <Image width={15.66} height={22.63} alt="logo" src="/union.svg" />
      </div>
      <h2 className="">Chiratae</h2>
    </Link>
  );
};

export default Logo;
