"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginButtonType = {
  title: string;
  icon?: any;
  href: string;
  type: string;
  imageHref?: string;
};

const LoginButton = ({
  title,
  icon,
  href,
  type,
  imageHref,
}: LoginButtonType) => {
  const router = useRouter();

  const handleSignIn = async () => {
    await signIn(type, { callbackUrl: href });
    router.push(href);
  };
  return (
    <button
      onClick={handleSignIn}
      className="bg-[#FFFFFF] py-3 px-4 rounded-md flex items-center justify-center gap-3 cursor-pointer w-[360px]"
    >
      {icon && icon}
      {imageHref && (
        <Image src={imageHref} height={20} width={20} alt="microsoft logo" />
      )}
      <p className="text-[#000000DE] font-semibold text-base">{title}</p>
    </button>
  );
};

export default LoginButton;
