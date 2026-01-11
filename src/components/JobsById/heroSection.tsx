"use client"
import { FaPlaystation } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { BsBuildings } from "react-icons/bs";
import { IoIosHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import "@/globals/styles/style.color.css"
import { motion } from "framer-motion";
import React,{useState} from "react";
import { PiMoney } from "react-icons/pi";
import { IoBagRemove } from "react-icons/io5";
import { MdEditDocument } from "react-icons/md";
import Link from "next/link";
import Section from "@/globals/section";

const Herosection = ()=>{
  const [isLiked,setIsLiked] = useState(false); 
  const [open, setOpen] = useState(false);
  return(
    <Section>
      <div className="border border-gray-400 bg-white py-5 px-6 flex flex-col gap-y-4 rounded-xl ">
      <div className="flex md:flex-row flex-col items-center justify-between md:gap-y-0 gap-y-4">
        <div className="flex items-center gap-x-4">
            <div>
                <FaPlaystation size={50} />
            </div>
            <div>
              <div className="inline-flex">
                <p className="text-xs  px-4 rounded-2xl Job_category_bg ">Technology</p>
              </div>
                <h2 className="text-2xl font-bold">Senior Product Designer</h2>
                <p className="flex items-center gap-x-2 text-sm text-gray-500"><BsBuildings size={15}/>at Playstation Cooperation</p>
                <div className="flex gap-x-3">
                    <p className="flex items-center justify-center gap-x-2 text-xs"><CiLocationOn size={10}/> Remote</p>
                    <p className="flex items-center justify-center gap-x-2 text-xs"><CiClock1 size={10}/> Full Time</p>
                     <p className="flex items-center justify-center gap-x-2 text-xs"><SlCalender size={10}/> Posted on: Dec 11, 2025</p>
                                        
                </div>
            </div>
      </div>
      <div className="flex items-center justify-between gap-x-4 ">
          <div className="p-0.5 rounded-md border " onClick={()=>setIsLiked(!isLiked)}>
          {isLiked ? <IoIosHeart size={25} color="red" className="cursor-pointer"/> : <CiHeart size={25} className="cursor-pointer"/>}
          </div>
          <motion.div className="p-0.5 rounded-md border relative"
          
          onHoverStart={() => setOpen(true)}
  onHoverEnd={() => setOpen(false)}>
            <GoShareAndroid size={25} className="cursor-pointer"/>
            <motion.div className="flex flex-col absolute border"
             animate={open ? "open" : "closed"}
    variants={{
      closed: {
        opacity: 0,
        scale: 0.2,
        y: 3,
        x: 5,
        pointerEvents: "none",
      },
      open: {
        opacity: 1,
        scale: 1,
        y: 3,
        x: 5,
        pointerEvents: "auto",
        transition: { duration: 0.3, ease: "easeInOut" }
      }
    }}
           
            >
              <Link href="">Facebook</Link>
              <Link href="">Instagram</Link>
              <Link href="">Whatsapp</Link>
            </motion.div>
          </motion.div>
      </div>
      </div>
      <hr className=" text-gray-400 " />
      <div className="flex md:flex-row flex-col  justify-between">
        <div className="grid grid-cols-2 md:grid-cols-3  gap-x-8 md:gap-y-0 gap-y-4 ">
        <div className="flex items-start gap-x-2 ">
          <PiMoney size={25}/>
          <div>
            <p className="text-md">Salary</p>
            <p className="text-xs text-gray-500">Npr 80,000 - Npr 170,000</p>
          </div>
          
        </div>
         <div className="flex items-start gap-x-2 ">
          <IoBagRemove size={25}/>
          <div>
            <p className="text-md">Experience</p>
            <p className="text-xs text-gray-500">+3 years</p>
          </div>
        </div>
         <div className="flex items-start gap-x-2 ">
          <MdEditDocument size={25}/>
          <div>
            <p className="text-md">Applicants</p>
            <p className="text-xs text-gray-500">126</p>
          </div>
        </div>
      </div>
      <div className="flex items-end  gap-x-6 mt-10">
        <button className=" py-2 px-10 rounded-lg cta_button text-lg font-semibold hover:cursor-pointer">Save Job</button>
        <Link href="/jobs/all" className=" py-2 px-10 rounded-lg text-lg text-white font-semibold cta_button_secondary hover:cursor-pointer ">Apply Now</Link>
      </div>
      </div>
    </div>
    </Section>
  )
}

export default Herosection;