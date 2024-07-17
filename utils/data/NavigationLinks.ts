  import { IconType } from "react-icons";
  import { FiLayers, FiUsers } from "react-icons/fi";
  import { HiOutlineChartSquareBar } from "react-icons/hi";
  import {
    RiHome6Line,
  } from "react-icons/ri";

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
    icon: FiLayers,
    label: "All Leads",
    disabled: false,
  },
  {
    href: "/Users",
    icon: FiLayers,
    label: "Sub Users",
    disabled: false,
  },
  {
    href: "/SendCustomMail",
    icon: FiLayers,
    label: "Send Custom Mail",
    disabled: false,
  },
  {
    href: "/PreviousSentMails",
    icon: FiLayers,
    label: "Previously Sent Mails",
    disabled: false,
  },
  {
    href: "/tests",
    icon: HiOutlineChartSquareBar,
    label: "Campaign",
    disabled:false,
    collapsed: true,
    children:[{
          href: "/Campaign",
          icon: FiLayers,
          label: "New Campaign",
          disabled: false,
        },
        {
          href: "/Past-Campaign",
          icon: FiLayers,
          label: "Past Campaign",
          disabled: false,
        }
      ]
  },
  {
        href: "/setting",
        icon: HiOutlineChartSquareBar,
        label: "Setting",
        disabled: false,
        collapsed:true,
        children:[{
              href: "/LinkedInAccounts",
              icon: FiLayers,
              label: "LinkedIn Login",
              disabled: false,
            },
            {
              href: "/EmailSettings",
              icon: FiLayers,
              label: "Email Setting",
              disabled: false,
            },
            {
              href: "/Lead-Status",
              icon: FiLayers,
              label: "Lead Status",
              disabled: false,
            }
          ]
  }
];
