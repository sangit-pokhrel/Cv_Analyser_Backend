"use client"
import React from "react";
import { RiGeminiLine } from "react-icons/ri";
import Section from "@/globals/section"
const Badge = ({children,icon}: {children: React.ReactNode,icon:React.ReactNode}) => {

  return(
              <div>
                {/* badge */}
             <div className=" flex justify-center items-center gap-x-2  bg-linear-to-r from-[#c3e7f8] to-[#64c4f8] px-3 py-2 rounded-2xl ">
               {icon}
               <span >{children}</span>
             </div>
              </div>
            
         
  );


}
export default Badge;