"use client"
import React,{useState} from "react";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { LuMoon } from "react-icons/lu";
import { GoSun } from "react-icons/go";
import './styles/style.color.css'
import { useContext } from "react";
import { ThemeContext } from "@/app/context/ThemeProvider";
import { RxHamburgerMenu } from "react-icons/rx";
import { DiVim } from "react-icons/di";
import { IoIosArrowDropright } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { RxCross2 } from "react-icons/rx";




const Navabar=()=>{
  const{theme,toggleTheme} = useContext(ThemeContext);
  const sections = [{name:"Jobs",link:"/jobs"},{name:"Analyse-Cv",link:"/analyse-cv"},{name:"About",link:"/about",},{name:"Services",link:"/services"},{name:"Contact",link:"/contact"}];
  const [isDarkMode,setIsDarkMode]=useState(false);
  const [isOpen,setIsOpen] = useState(false);
  const handleClick = ()=>{
      setIsOpen(prev=>!prev);
  }
  return(
    <div>
      <div className="fixed top-0 left-0 right-0 z-50  py-2 ">
      <div className="backdrop-blur-sm bg-white/40 w-[80%]  h-1/2 border border-gray-400 flex items-center-safe justify-evenly  p-2 mx-auto rounded-4xl ">
        <div >
          <p>Logo</p>
        </div>
        <div className="md:grid grid-cols-5 gap-1  hidden  ">
          {sections.map((section)=>{
            return(
             
                <Link className="text-center"key={section.name} href={section.link}>
                {section.name}
              </Link>
           
            )
          })}
        </div>
        <div className="flex gap-3 items-center">
          <div>
            <CiSearch size={20} />  
          </div>
          <div className="cursor-pointer" onClick={toggleTheme} >
              {theme!=='light' ? (
                <LuMoon size={20} onClick={() => setIsDarkMode(prev=>!prev)} />
              ) : (
                <GoSun size={20} onClick={() => setIsDarkMode(prev=>!prev)} />
              )}
          </div>
          <div>
              <button className="cta_button_secondary px-3 py-1 rounded-xl text-white">Get Started</button>
          </div>
        </div>
        <div className="md:hidden" onClick = {handleClick}>
          <RxHamburgerMenu/>
        </div>
      </div>
    </div>
 
 {/* Mobile View  */}
      <AnimatePresence>
         {isOpen && (
  <div className="fixed inset-0 z-50 flex items-start ">
    {/* Blurred background */}
    <div className="absolute inset-0 bg-white/20  backdrop-blur-sm" onClick={handleClick}></div>

    {/* Navbar content */}
    <motion.div className=" relative h-screen z-50 w-[60%] bg-white"
    initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <div className=" absolute top-3 right-3" onClick={handleClick}>
            <RxCross2/>
          </div>
      <div className=" h-screen gap-y-5 grid grid-cols-1 items-center  ">
       <div className="grid grid-cols-1 gap-y-8 px-5">
         {sections.map((section) => (
          <div key={section.name} className="text-2xl flex justify-start items-center gap-x-4 in-active:cta_button_secondary  ">
           <IoIosArrowDropright /> <Link href={section.link}>{section.name}</Link>
            
          </div>
        ))}
       </div>
      </div>
    </motion.div>
  </div>
)}

      </AnimatePresence>
     

    </div>
  )
}
export default Navabar;