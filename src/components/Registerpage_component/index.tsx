// "use client";
// import React from "react";
// import "@/globals/styles/style.color.css";
// import Image from "next/image";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";
// import Link from "next/link";
// import signInWithGoogle from "@/globals/signInFunc";

// import RegistrationForm from "./form";

// const Registerpage = ()=>{

  

//   return(
//     <div className="primary-bg  h-screen flex justify-evenly items-center " >
//       <div className=" w-[90%] h-full  md:grid grid-cols-2 items-center justify-between p-5 ">
//         <div className="hidden md:flex w-[90%] h-full">
        
//         <img className=" w-full h-full rounded-xl" src="/Register_page_Image.jfif" alt="Login Image" />
//       </div>
//       <div className=" h-full ">
//             <div>
//               <h1 className="font-semibold text-3xl">Create An Account</h1>
//             <p className="font-thin text-gray-500 text-sm mt-0">New to the site ? No worries registration is easy as finding job on Cv Saathi !</p>
//             </div>
//             <RegistrationForm/>
//             <div className="flex justify-center items-center">
//               <p className="text-sm">Already have an account ? <Link href="/login" className="text-blue-500 underline">Sign in</Link> </p>
//             </div>
             

//           <div className=" flex justify-center items-center">
//               <hr className="mt-4 w-[90%] text-gray-400 " />
//           </div>
//           <div className="flex flex-col md:flex-row justify-center items-center gap-x-1.5 mt-3">
//             <div>
//                 <button onClick={signInWithGoogle} className="flex justify-center items-center gap-x-2 border-2 border-gray-300 rounded-4xl px-8 py-3 hover:bg-gray-200 cursor-pointer">
//                   <div>
//                     <FcGoogle size={25} />
//                   </div>
//                   <div>
//                     <p className=" text-gray-500">Continue With Google</p>
//                   </div>
//                 </button>
//             </div>
//             <div>
//               <p className="text-md">OR</p>
//             </div>
//             <div>
//                 <button className="flex justify-center items-center gap-x-2 border-2 border-gray-300 rounded-4xl px-5 py-3 hover:bg-gray-200 cursor-pointer">
//                   <div>
//                     <FaFacebook size={25} />
//                   </div>
//                   <div>
//                     <p className=" text-gray-500">Continue With Facebook</p>
//                   </div>
//                 </button>
//             </div>
//             <div>

//             </div>
//             <div>

//             </div>
//           </div>

//       </div>
//       </div>
//     </div>
//   )
// }
// export default Registerpage;


"use client";
import React from "react";
import "@/globals/styles/style.color.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import signInWithGoogle from "@/globals/signInFunc";
import RegistrationForm from "./form";

const Registerpage = () => {
  return (
    // FULL VIEWPORT – DEAD CENTER
    <div className="min-h-screen bg-[#F8FCFF] flex items-center justify-center">
      
      {/* CONTENT WIDTH – SAME AS LOGIN */}
      <div className="w-full max-w-6xl">
        
        {/* MAIN ROW */}
        <div className="flex flex-col lg:flex-row items-start gap-12 align-middle m-auto justify-center ">

          {/* LEFT – FORM */}
          <div className="w-[520px] flex flex-col justify-center">

            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Create An Account
              </h1>
              <p className="text-sm text-gray-500">
                New to the site? No worries, registration is easy as finding a job on Cv Saathi!
              </p>
            </div>

            <RegistrationForm />

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 font-medium hover:underline">
                Sign in
              </Link>
            </p>

            <div className="my-6 border-t border-gray-300" />

            {/* SOCIAL LOGIN – SAME STYLE AS LOGIN */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-600 whitespace-nowrap"
              >
                <FcGoogle className="w-5 h-5" />
                Continue With Google
              </button>

              <span className="text-sm text-gray-400 font-medium">
                OR
              </span>

              <button
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-600 whitespace-nowrap"
              >
                <FaFacebook className="w-4 h-4 text-blue-600" />
                Continue With Facebook
              </button>
            </div>
          </div>

          {/* RIGHT – IMAGE (SAME SIZE AS LOGIN) */}
          <div className="hidden lg:block">
            <div className="w-[420px] h-[560px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/Register_page_Image.jfif"
                alt="Register visual"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Registerpage;
