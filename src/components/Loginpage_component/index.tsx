"use client";
import React from "react";
import "@/globals/styles/style.color.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useEffect } from "react";
import Link from "next/link";
import signInWithGoogle from "@/globals/signInFunc";
import LoginForm from "./form";


const Loginpage = ()=>{
 
  return(
    <div className="primary-bg  h-screen flex justify-evenly items-center ">
      <div className=" w-[90%] h-full  grid grid-cols-1 md:grid-cols-2 items-center justify-items-center p-5 ">
        <div className="hidden md:flex w-[90%] h-full">
        
        <img className=" w-full h-full rounded-xl" src="/Register_page_Image.jfif" alt="Login Image" />
      </div>
      <div className=" h-full ">
            <div>
              <h1 className="font-semibold text-3xl">Sign In</h1>
            <p className="font-thin text-gray-500 text-sm mt-0"> Seems like you have already an axxount. Let's make the Cv Better !!!</p>
            </div>
            <LoginForm/>
            <div className="flex justify-center items-center">
              <p className="text-sm">Don't have an account ? <Link href="/Register" className="text-blue-500 underline">Register Here</Link> </p>
            </div>
             

          <div className=" flex justify-center items-center">
              <hr className="mt-4 w-[90%] text-gray-400 " />
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-x-1.5 mt-3">
            <div>
                <button onClick={signInWithGoogle} className="flex justify-center items-center gap-x-2 border-2 border-gray-300 rounded-4xl px-8 py-3 hover:bg-gray-200 cursor-pointer">
                  <div>
                    <FcGoogle size={25} />
                  </div>
                  <div>
                    <p className=" text-gray-500">Continue With Google</p>
                  </div>
                </button>
            </div>
            <div>
              <p className="text-md">OR</p>
            </div>
            <div>
                <button className="flex justify-center items-center gap-x-2 border-2 border-gray-300 rounded-4xl px-5 py-3 hover:bg-gray-200 cursor-pointer">
                  <div>
                    <FaFacebook size={25} />
                  </div>
                  <div>
                    <p className=" text-gray-500">Continue With Facebook</p>
                  </div>
                </button>
            </div>
            <div>

            </div>
            <div>

            </div>
          </div>

      </div>
      
      </div>
    </div>
  )
}
export default Loginpage;