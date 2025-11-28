"use client";
import React from "react";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import "@/globals/styles/style.color.css"
import Link from "next/link";
 const LoginForm=()=>{
type formdata={email:string,password:string};
  const {register,handleSubmit,formState:{errors},watch}=useForm<formdata>();
   const [show,setShow]=useState(false);
  
    const handleClick=()=>{
     setShow(!show);
   
    }
    const password=watch("password");

    const onSubmit=(data:formdata)=>{
      console.log(data);
    }
  
  return(
     <div >
                  <form className=" flex flex-col  mt-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-y-1">
                      
                    

                    {/* Email */}

                    <div >
                      <label htmlFor="Email" className="ml-1">Email</label>
                    <input {...register("email",{required:true})} id="Email" className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200" type="email"  />
                    {errors.email && <span className=" text-red-500">This field is required</span>}
                    </div>

                    {/* Password  */}

                     <div>
                      <div className="relative" >
                      <label htmlFor="Password" className="ml-1">Password</label>
                    <input {...register("password",{required:true,minLength:8})} id="Password" className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200" type={show?"text":"password"} />
                    {errors.password && <span className=" text-red-500">This field is required and should be at least 8 characters</span>}
                     <div onClick={handleClick}>
                      {!show ? <FaRegEyeSlash className=" absolute top-10 right-1   cursor-pointer"/> : <FaRegEye className=" absolute top-10 right-1  cursor-pointer"/>}
                    </div>
                    </div>
                   
                     </div>
                     
                    </div>

                      {/* Aggrement checkbox */}
                      
                     <div className="flex justify-end">
                      <Link href="" className="text-sm text-blue-500 underline">Forgot password ?</Link>
                     </div>

                     {/* submit button */}
                   <div className="flex justify-center items-center pt-3">
                    <button type="submit" className="cta_button px-14 py-3 rounded-md cursor-pointer ">Sign In</button>
                   </div>
                    </form>
                </div>
  );
}


export default LoginForm;