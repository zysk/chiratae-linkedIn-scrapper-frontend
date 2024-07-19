"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
// import { FiBell, FiSearch } from "react-icons/fi";
// import { Button } from "@/components/ui/button";

export const Header = () => {
  // const { data: session } = useSession();
  const session = {}
  const router = useRouter();
  const pathName = usePathname();

  // const showBackButton = /^\/tests\/.+/.test(pathName);

  return (
    <div className="flex px-20 py-8 justify-end bg-[#ede9e9]">
      {/* <div className="w-full"> */}
        {/* {!showBackButton && (
          <Input
            className="bg-[#1C1C1C] border border-[#FFFFFF1A] w-2/5"
            // startIcon={<FiSearch size={15} />}
            placeholder="Search"
          />
        )} */}

        {/* {showBackButton && (
          <Button
            // iconStart={<ArrowLeft />}
            className="border border-[#FFFFFF1A] shadow-[0px_1px_2px_0px_#1018280D] px-4 py-[20px]"
            onClick={() => router.back()}
          >
            Back
          </Button>
        )} */}
      {/* </div> */}
      <div className="flex items-center gap-x-10">
        <Avatar className="cursor-pointer">
          <AvatarImage src={session?.user?.image ?? "I"} alt="@shadcn" />
          <AvatarFallback>{session?.user?.name?.charAt(0) ?? "U"}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
