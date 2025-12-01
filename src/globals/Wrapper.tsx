"use client";

import React from "react";
import { ThemeContext } from "@/app/context/ThemeProvider";
import { useContext } from "react";
import './styles/style.color.css'
const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useContext(ThemeContext); 
  return <div className={theme === 'light' ? 'primary-bg   ' : 'secondary-bg text-white '}>{children}</div>;
}

// export const NavWrapper = ({ children }: { children: React.ReactNode }) => {
//   const { theme } = useContext(ThemeContext); 
//   return <div className={theme === 'light' ? 'primary-bg ' : 'secondary-bg'}>{children}</div>;
// }

export default ClientWrapper;


