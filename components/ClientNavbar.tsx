'use client'
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

const ClientNavbar = () => {
  const pathname = usePathname();
  // Hide navbar on all dashboard routes
  const hideNavbarRoutes = ['/dashboard'];

  if (hideNavbarRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return null;
  }

  return <Navbar />;
};

export default ClientNavbar;