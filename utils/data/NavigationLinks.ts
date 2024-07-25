  import { IconType } from "react-icons";
  import { FiLayers, FiUsers } from "react-icons/fi";
  import { HiOutlineChartSquareBar } from "react-icons/hi";
  import {
    RiHome6Line,
  } from "react-icons/ri";
  import { MdOutlineCampaign } from "react-icons/md";
  import { IoMdAdd } from "react-icons/io";
  import { MdOutlineContentPaste } from "react-icons/md";
  import { LuMailPlus } from "react-icons/lu";
  import { RiMailCheckLine } from "react-icons/ri";
  import { PiUsersThree } from "react-icons/pi";
  import { PiUsers } from "react-icons/pi";
  import { MdOutlineSettings } from "react-icons/md";
  import { FaLinkedinIn } from "react-icons/fa6";
  import { RiLinkedinLine } from "react-icons/ri";
  import { MdOutlineMailOutline } from "react-icons/md";
  import { MdInfoOutline } from "react-icons/md";
export interface NavigationLink {
  href: string;
  icon: IconType;
  label: string;
  disabled?: boolean;
  collapsed?: boolean;
  children?:Array<{
    href: string;
    icon: IconType;
    label: string;
    disabled?: boolean;
  }>;
}

export const navigationLinks: NavigationLink[] = [
  {
    href: "/",
    icon: RiHome6Line,
    label: "Home",
  },
  {
    href: "/All-Leads",
    icon: PiUsersThree,
    label: "All Leads",
    disabled: false,
  },
  {
    href: "/Users",
    icon: PiUsers,
    label: "Sub Users",
    disabled: false,
  },
  {
    href: "/SendCustomMail",
    icon: LuMailPlus,
    label: "Send Custom Mail",
    disabled: false,
  },
  {
    href: "/PreviousSentMails",
    icon: RiMailCheckLine,
    label: "Previously Sent Mails",
    disabled: false,
  },
  {
    href: "/",
    icon: MdOutlineCampaign,
    label: "Campaign",
    disabled:false,
    collapsed: true,
    children:[{
          href: "/Campaign",
          icon: IoMdAdd,
          label: "New Campaign",
          disabled: false,
        },
        {
          href: "/Past-Campaign",
          icon: MdOutlineContentPaste,
          label: "Past Campaign",
          disabled: false,
        }
      ]
  },
  {
        href: "/setting",
        icon: MdOutlineSettings,
        label: "Setting",
        disabled: false,
        collapsed:true,
        children:[{
              href: "/LinkedInAccounts",
              icon: RiLinkedinLine,
              label: "LinkedIn Login",
              disabled: false,
            },
            {
              href: "/EmailSettings",
              icon: MdOutlineMailOutline,
              label: "Email Setting",
              disabled: false,
            },
            {
              href: "/Lead-Status",
              icon: MdInfoOutline,
              label: "Lead Status",
              disabled: false,
            }
          ]
  }
];
