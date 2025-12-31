'use client'
import Link from "next/link"
import useVerifyEmailMutation from "./api/verifyEmail";
import { useEffect } from "react";
const VerifyEmailIndex = ()=>{
  const verifyEmaiMutation = useVerifyEmailMutation();

   useEffect(()=>{
     verifyEmaiMutation.mutate(localStorage.getItem("Email"));
   },[]);
  
  return(
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center gap-y-2">
          <h1>Your Email is Verified:</h1>
          <div  className="border w-fit px-8 py-2 rounded-lg cursor-pointer">
            <Link href ='/login'>Please Login to continue</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default VerifyEmailIndex;