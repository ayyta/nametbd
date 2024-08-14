'use client';
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NavBar from "./NavBar.jsx";

export default function NavBarWrapper() {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  const isLoginExtensions = ["/login", "/register"];
  if (isLoginExtensions.includes(pathname)) {
    return null;
  }
  return <NavBar />;
}