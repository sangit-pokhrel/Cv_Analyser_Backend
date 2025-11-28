"use client"
import React from "react";
import { RiGeminiLine } from "react-icons/ri";
import Section from "@/globals/section"
const Badge = ({children,icon}: {children: React.ReactNode,icon:React.ReactNode}) => {

  return(
          <Section>
                 {/* badge */}
             <div className=" inline bg-linear-to-r from-[#c3e7f8] to-[#64c4f8] text-black text-sm font-medium      mr-2 px-3 py-2 rounded-2xl ">
               {icon}
               <span >{children}</span>
             </div>
          </Section>
            
         
  );


}
export default Badge;