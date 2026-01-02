// import React from "react";
// import "@/globals/styles/style.color.css";
// import { HiOutlineBolt } from "react-icons/hi2";
// import { FiTarget } from "react-icons/fi";
// import ResumeUploadSec from "@/globals/ResumeUploadSection/resumeUploadSec";
// import Section from "@/globals/section";
// const HeroSection = () => {
//   return (
//     <Section>
//           <div className="grid md:grid-cols-2 grid-cols-1 justify-center items-start ">
//       {/* left Section */}
//       <div className="flex flex-col  items:center md:items-start justify-center gap-y-10">
//         <div className="flex flex-col gap-y-2">
//           <h1 className="text-4xl md:w-[50%]">
//             Transform Your Resume Into Your{" "}
//             <span className="font-extrabold text-blue-500">Dream Job</span>
//           </h1>
//           <p className="font-extralight text-sm text-gray-500 md:w-[50%]">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
//             laboriosam, aperiam praesentium rem, dolorem ea quam laborum id
//             magni voluptas voluptate necessitatibus dolore laudantium!
//             Praesentium recusandae nesciunt ab magnam molestias.
//           </p>
//         </div>

//         {/* cta buttons  */}
//         <div className="flex">
//           <button className=" flex justify-center items-center cta_button text-white px-2 py-2 rounded-md mr-4">
//             <HiOutlineBolt className="inline mr-1 " size={20} />
//             <p className="md:text-normal text-sm"> Analyse Now - Its's Free</p>
//           </button>
//           <button className="border border-blue-500 text-black px-4 py-2 rounded-md flex justify-center items-center">
//             <FiTarget className="inline mr-1 " size={20} />

//             <p className="font-semibold text-gray-400 md:text-normal text-sm"> See How It Works</p>
//           </button>
//         </div>
//         {/* Ratings,Resume Analysed, Success Ratio  */}

//         <div className="flex bg-white gap-x-1 ">
//           <div className="flex flex-col justify-center primary-bg items-center px-2 py-2 min-w-[100px]">
//             <h2 className="text-2xl font-extrabold ">50k+</h2>
//             <p className="text-xs font-extralight text-gray-400">
//               Total Resumes Analysed
//             </p>
//           </div>

//           <div className="flex flex-col justify-center items-center primary-bg px-2 py-2 min-w-[100px]">
//             <h2 className="text-2xl font-extrabold">4.9/5</h2>
//             <p className="text-xs font-extralight text-gray-400">User Rating</p>
//           </div>

//           <div className="flex flex-col justify-center items-center primary-bg px-2 py-2 min-w-[100px]">
//             <h2 className="text-2xl font-extrabold">96%</h2>
//             <p className="text-xs font-extralight text-gray-400">
//               Success Rate
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex justify-center items-center">
//        <ResumeUploadSec/>
//       </div>
//     </div>
//     </Section>
        
//   );
// };
// export default HeroSection;

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBolt, HiSparkles } from "react-icons/hi2";
import { FiPlay, FiCheckCircle, FiUploadCloud, FiFile, FiX } from "react-icons/fi";
import { BsStars, BsFiletypePdf, BsFileWord } from "react-icons/bs";
import { useDropzone } from "react-dropzone";
import ResumeUploadSec from "@/globals/ResumeUploadSection/resumeUploadSec";
// ============== ANIMATED RESUME UPLOAD COMPONENT ==============

// ============== MAIN HERO SECTION ==============
const HeroSection = () => {
  return (
    <section className="relative bg-linear-to-br from-slate-50 via-white to-cyan-50/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content - No extra padding at top */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-80px)] py-8">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Jobs Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-full text-sm font-medium shadow-lg shadow-cyan-600/25">
                <BsStars className="text-yellow-300" />
                1000+ Jobs Available
              </span>
            </motion.div>

            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-cyan-200 rounded-full text-sm">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <span className="text-cyan-600 font-medium">#1 AI Resume Analyzer</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1]"
            >
              Transform Your
              <br />
              Resume Into{" "}
              <span className="relative inline-block">
                <span className="text-cyan-500">Dream Job</span>
                <svg 
                  className="absolute -bottom-2 left-0 w-full" 
                  viewBox="0 0 200 8" 
                  fill="none"
                >
                  <path 
                    d="M2 6 Q100 2 198 6" 
                    stroke="#06b6d4" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-base sm:text-lg max-w-md"
            >
              Get instant AI-powered feedback. Optimize for ATS systems
              and land more interviews with our cutting-edge analysis.
            </motion.p>

            {/* Feature Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              {["ATS Optimized", "AI-Powered", "Free"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm"
                >
                  <FiCheckCircle className="text-green-500" size={14} />
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5">
                <HiOutlineBolt className="text-xl" />
                Analyze Now - Free
              </button>

              <button className="inline-flex items-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
                <div className="w-9 h-9 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <FiPlay className="text-white ml-0.5" />
                </div>
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Right - Upload Component */}
          <div className="flex justify-center lg:justify-end">
            <ResumeUploadSec/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;