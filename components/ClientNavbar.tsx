'use client'
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

const ClientNavbar = () => {
  const pathname = usePathname();
  const hideNavbarRoutes = ['/signup', '/login']; // Add more routes as needed

  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  return <Navbar />;
};

export default ClientNavbar;