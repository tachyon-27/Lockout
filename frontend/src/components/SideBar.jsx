import  { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  ArrowLeft,
  Home,
  Settings,
  Users,
  Gamepad2,
  LucideBadge,
} from "lucide-react";
import {Link} from "react-router-dom";
import { motion } from "framer-motion";

export function SideBar() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Back to main",
      href: "/",
      icon: (
        <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <LucideBadge className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Tournaments",
      href: "/admin/dashboard/tournaments",
      icon: (
        <Gamepad2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Add Tournament",
      href: "/admin/dashboard/add-tournament",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Admins",
      href: "/admin/dashboard/admins",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/admin/logout",
      icon: (
        <ArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen} >
      <SidebarBody className=" min-h-screen justify-between gap-10">
          <div className="z-[51] fixed flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
                ))}
            </div>
          </div>
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    (<Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div
        className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre">
        Lockout
      </motion.span>
    </Link>)
  );
};
export const LogoIcon = () => {
  return (
    (<Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div
        className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>)
  );
};

