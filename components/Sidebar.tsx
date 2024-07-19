"use client";

import Logo from "@/components/Logo";
import { NavigationLink, navigationLinks } from "@/utils/data/NavigationLinks";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiLayers } from "react-icons/fi";
import { FaCircleChevronDown } from "react-icons/fa6";
import { FaCircleChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";


export const Sidebar : React.FC = () => {
  const pathName = usePathname();
  const [navigationData, setNavigationData] = useState(navigationLinks)
  // console.log("NavigationData",NavigationData)

  const updateNavData = (data:any) =>{
    let temp_data = navigationData.map((navData:any)=> {
      if(navData.label === data.label){
        return {...navData,collapsed:!navData.collapsed};
      }
      else{
        return navData;
      }
    })
    setNavigationData(temp_data)
  }
  let isActive
  return (
    <aside className="flex sticky top-0 left-0 h-screen w-[280px] bg-white shadow-lg p-8">
      <div className="space-y-3 w-full">
        <Logo />
        <div className="flex-1 flex flex-col justify-between h-[80vh]">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {navigationData.map((link, index) => {
              isActive =
                pathName === link.href ||
                (pathName.startsWith(link.href) && link.href !== "/");
                return(
                  <li key={index} className="rounded-sm">
                    {
                      link.children ? <>
                      <div className="flex flex-row justify-between items-center rounded-md cursor-pointer" onClick={()=>updateNavData(link)}>
                          {/* {getIcon(link.icon, 24)} */}
                          <div className="flex py-2.5 px-4 space-x-3">
                            <link.icon size={24} />  
                            <span>{link.label}</span>
                          </div>
                          
                          {link.collapsed ? (
                            <FaChevronDown size={15}/>
                          ) : (
                            <FaChevronUp size={15}/>
                          )}
                      </div>
                      <ul className={`ps-4 space-y-1 text-sm ${link.collapsed ? 'max-h-0 overflow-hidden' : ''}`}>
                        {
                          link.children.map((child, childindex) => {
                            isActive = pathName === child.href ||
                            (pathName.startsWith(link.href) && link.href !== "/")
                            return (
                              <li key={childindex} className="rounded-sm">
                              {link.disabled ? (
                                <div className="flex items-center py-2.5 px-4 space-x-3 rounded-md opacity-50 cursor-not-allowed">
                                  {/* {getIcon(link.icon, 24)} */}
                                  <link.icon size={24} />
                                  <span>{child.label}</span>
                                </div>
                              ) : (
                                <Link
                                  href={child.href}
                                  className={`flex items-center py-2.5 px-4 space-x-3 rounded-md hover:bg-gray-500/10 transition-colors duration-300 
                                  ${isActive && "bg-[#e2e8f0]"}`}
                                >
                                  <link.icon size={24} />
                                  {/* {getIcon(link.icon, 24)} */}
    
                                  <span>{child.label}</span>
                                </Link>
                              )}
                            </li>
                            );
                          })
                        }
                      </ul>
                    </>:
                    <>
                        {link.disabled ? (
                          <div className="flex items-center py-2.5 px-4 space-x-3 rounded-md opacity-50 cursor-not-allowed">
                            {/* <link.icon size={24} /> */}
                            <span>{link.label}</span>
                          </div>
                        ) : (
                          <Link
                            href={link.href}
                            className={`flex items-center py-2.5 px-4 space-x-3 rounded-md hover:bg-gray-500/10 transition-colors duration-300 
                            ${isActive && "bg-[#e2e8f0]"}`}
                          >
                            <link.icon size={24} />
                            {/* {getIcon(link.icon, 24)} */}
      
                            <span>{link.label}</span>
                          </Link>
                        )}
                      </>
                        }
                  </li>
                )
            })}
          </ul>

          <ul>
            <li
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center text-sm cursor-pointer py-2.5 px-4 space-x-3 rounded-md hover:bg-gray-500/10 transition-colors duration-300"
            >
              <LogOutIcon size={24} />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
