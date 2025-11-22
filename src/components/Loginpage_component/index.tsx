"use client";
import React from "react";
import { useState,useRef } from "react";
import "@/globals/styles/style.color.css";
import Image from "next/image";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";


const Loginpage = ()=>{

  const [show,isshow]=useState(false);

  const passwordRef =useRef<HTMLInputElement>(null);
  const confirmPasswordRef =useRef<HTMLInputElement>(null);
  const handleClick=()=>{
   isshow(!show);
   if(passwordRef.current){
    if(!show){
      passwordRef.current.type='text';
    }
    else{
      passwordRef.current.type='password';
    }
   } 
   if(confirmPasswordRef.current){
    if(!show){
      confirmPasswordRef.current.type='text';
    }
    else{
      confirmPasswordRef.current.type='password';
    }
   } 
  }

  const handleChange=()=>{
    if(confirmPasswordRef.current && passwordRef.current){
      if(confirmPasswordRef.current.value !== passwordRef.current.value){
        confirmPasswordRef.current.style.borderColor="red";
      }
      else{
        confirmPasswordRef.current.style.borderColor="green";
      }
    }
  }

  return(
    <div className="primary-bg  h-screen flex justify-evenly items-center " style={{fontFamily:"Montserrat"}}>
      <div className=" w-[90%] h-full  grid grid-cols-2 items-center justify-between p-5 ">
        <div className=" w-[90%] h-full">
        {/* <Image src={"/Login_page_image.jpg"} alt="login_image" width={500} height={1059}/> */}
        <img className=" w-full h-full rounded-xl" src="/Login_page_image.jpg" alt="Login Image" />
      </div>
      <div className=" h-full ">
            <div>
              <h1 className="font-semibold text-3xl">Create An Account</h1>
            <p className="font-light text-sm mt-0">New to the site ? No worries registration is easy as finding job on Cv Saathi !</p>
            </div>
            <div>
              <form className=" flex flex-col gap-5 mt-5">
                <div className="grid grid-cols-2 gap-x-5">
                  <div>
                    <label htmlFor="Full Name" className="ml-1">Full Name</label>
                <input id="Full Name" className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-200 " type="text"  />
                  </div>
               <div>
                 <label htmlFor="Phone Number" className="ml-1" >Phone Number</label>
                <input id="Phone Number" className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200" type="text" />

               </div>
               
                </div>
                <div >
                  <label htmlFor="Email" className="ml-1">Email</label>
                <input id="Email" className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200" type="email"  />
                </div>
                 <div>
                  <div >
                  <label htmlFor="Password" className="ml-1">Password</label>
                <input id="Password" ref={passwordRef} className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200" type="password"  />
                </div>
                <div onClick={handleClick}>
                  {!show ? <FaRegEyeSlash className="  relative bottom-7 left-[95%] cursor-pointer"/> : <FaRegEye className=" relative bottom-7 left-[95%] cursor-pointer"/>}
                </div>
                 </div>
                 <div>
                  <div >
                  <label htmlFor=" Confirm Password" className="ml-1"> Confirm Password</label>
                <input onChange={handleChange} id=" Confirm Password" ref={confirmPasswordRef} className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200" type="password"  />
                </div>
                <div onClick={handleClick}>
                  {!show ? <FaRegEyeSlash className="  relative bottom-7 left-[95%] cursor-pointer"/> : <FaRegEye className=" relative bottom-7 left-[95%] cursor-pointer"/>}
                </div>
                 </div>
               
                </form>
            </div>


      </div>
      </div>
    </div>
  )
}
export default Loginpage;