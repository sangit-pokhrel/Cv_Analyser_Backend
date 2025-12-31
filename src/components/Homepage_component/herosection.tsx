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

// ============== ANIMATED RESUME UPLOAD COMPONENT ==============
const AnimatedResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      simulateAnalysis();
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setIsAnalyzing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative w-full max-w-sm"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-lg opacity-25" />

      {/* Main Card */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-white/90 text-sm font-medium ml-2">
              Resume Analyzer
            </span>
            <HiSparkles className="text-yellow-300 ml-auto" />
          </div>
        </div>

        {/* Upload Area */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...getRootProps()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-300
                  ${isDragActive 
                    ? "border-cyan-500 bg-cyan-50" 
                    : "border-gray-200 hover:border-cyan-400 hover:bg-gray-50"
                  }
                `}
              >
                <input {...getInputProps()} />
                
                {/* Animated Icon */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl flex items-center justify-center mb-4"
                >
                  <FiUploadCloud className="text-3xl text-cyan-500" />
                </motion.div>

                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Drop your resume here
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  or click to browse
                </p>

                {/* File Types */}
                <div className="flex justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg text-xs text-red-600 font-medium">
                    <BsFiletypePdf /> PDF
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg text-xs text-blue-600 font-medium">
                    <BsFileWord /> DOC
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                {/* File Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FiFile className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {!isAnalyzing && progress < 100 && (
                    <button
                      onClick={removeFile}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <FiX className="text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {(isAnalyzing || progress > 0) && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        {progress < 100 ? "Analyzing..." : "Complete!"}
                      </span>
                      <span className="text-cyan-600 font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Analysis Complete */}
                {progress === 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">92</p>
                      <p className="text-xs text-gray-500">ATS Score</p>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded-lg">
                      <p className="text-lg font-bold text-amber-600">15</p>
                      <p className="text-xs text-gray-500">Tips</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">8</p>
                      <p className="text-xs text-gray-500">Keywords</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              50K+ analyzed
            </span>
            <span>⭐ 4.9/5 rating</span>
          </div>
        </div>
      </div>

      {/* Floating Star */}
      <motion.div
        animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg flex items-center justify-center"
      >
        <BsStars className="text-white" />
      </motion.div>
    </motion.div>
  );
};

// ============== MAIN HERO SECTION ==============
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 overflow-hidden">
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
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5">
                <HiOutlineBolt className="text-xl" />
                Analyze Now - Free
              </button>

              <button className="inline-flex items-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <FiPlay className="text-white ml-0.5" />
                </div>
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Right - Upload Component */}
          <div className="flex justify-center lg:justify-end">
            <AnimatedResumeUpload />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;