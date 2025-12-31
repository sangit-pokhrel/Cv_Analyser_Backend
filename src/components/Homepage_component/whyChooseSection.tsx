// "use client"
// import React,{useState} from 'react'
// import { FiTarget} from "react-icons/fi";
// import Section from '@/globals/section';

// interface CardsDataType{
//   icon:React.ReactNode
//   Heading:string,
//   Description:string
// };
// const  CardsData:CardsDataType[] =[{
//   icon:<FiTarget size={20}/>,
//   Heading:"Ats Optimization",
//   Description:"Ensure your resume passes Applicant Tracking System"
// },
// {
//   icon:<FiTarget size={20}/>,
//   Heading:"Ats Optimization",
//   Description:"Ensure your resume passes Applicant Tracking System"
// },
// {
//   icon:<FiTarget size={20}/>,
//   Heading:"Ats Optimization",
//   Description:"Ensure your resume passes Applicant Tracking System"
// },
// {
//   icon:<FiTarget size={20}/>,
//   Heading:"Ats Optimization",
//   Description:"Ensure your resume passes Applicant Tracking System"
// }];

// const Cards = ({data}:{data:CardsDataType})=>{
 
//   return(
//     <div className='bg-white rounded-md md:max-w-[400px] py-4'>
//       <div className='flex flex-col gap-y-2 px-4 '>
//         <div>
//           {data.icon}
//         </div>
//            <h5 className='font-semibold text-lg'>{data.Heading} </h5>
//            <p className='text-sm text-gray-400'>{data.Description}</p>

//       </div>
//     </div>
//   )
// }

// const WhyChooseSection =()=>{
//    const [isSeeMore,setIsSeeMore] = useState(false);
//    const handleSeemore =()=>{
//     setIsSeeMore(prev=>!prev);
//    }
//   return(
//     <Section>
     
//            <div className="flex flex-col gap-y-8 py-6 w-full">
//               <div className="flex flex-col justify-center items-center gap-y-4" >
//                 <h2 className="text-3xl text-white text-center font-bold">Why Choose Cv Saathi ?</h2>
//                 <p className=" text-md md:text-xs text-white  text-center">Our AI-powered platform provides comprehensive analysis to help land your dream job</p>
//               </div>
//                {/* Desktop View */}
//               <div className=" hidden md:flex justify-evenly gap-x-10 px-10">
//                 {
//                   CardsData.map((data,index)=>
//                     <div key={index}>
//                       <Cards data={data}/>
//                     </div>
//                   )
//                 }

//               </div>
//                <div className="md:hidden flex flex-col justify-center items-center gap-y-5">
//                 {
//                   !isSeeMore?CardsData.slice(0,1).map((data,index)=>
//                     <div key={index}>
//                       <Cards data={data}/>
//                     </div>
//                   ):CardsData.map((data,index)=>
//                     <div key={index}>
//                       <Cards data={data}/>
//                     </div>
//                   )
//                 }
//                   <button className='text-white ' onClick={handleSeemore}>{!isSeeMore?"See More...":"See Less"}</button>
//               </div>
//             </div>
//     </Section>
   
//   )
// }

// export default WhyChooseSection;


"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTarget,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { BsRobot, BsLightningCharge } from "react-icons/bs";

interface CardDataType {
  icon: React.ReactNode;
  heading: string;
  description: string;
  color: string;
  bgGradient: string;
}

const cardsData: CardDataType[] = [
  {
    icon: <FiTarget size={24} />,
    heading: "ATS Optimization",
    description:
      "Ensure your resume passes Applicant Tracking Systems with our smart keyword analysis and formatting checks.",
    color: "cyan",
    bgGradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: <BsRobot size={24} />,
    heading: "AI-Powered Analysis",
    description:
      "Get intelligent feedback powered by advanced AI that understands what recruiters are looking for.",
    color: "purple",
    bgGradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: <BsLightningCharge size={24} />,
    heading: "Instant Results",
    description:
      "Receive comprehensive feedback in seconds, not hours. Quick analysis to improve your resume fast.",
    color: "amber",
    bgGradient: "from-amber-500 to-orange-500",
  },
  {
    icon: <FiShield size={24} />,
    heading: "Privacy First",
    description:
      "Your data is secure. We never share your personal information or resume content with third parties.",
    color: "green",
    bgGradient: "from-green-500 to-emerald-500",
  },
];

const Card = ({
  data,
  index,
}: {
  data: CardDataType;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* Card Glow Effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${data.bgGradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
      />

      {/* Card Content */}
      <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
        {/* Icon Container */}
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${data.bgGradient} flex items-center justify-center text-white mb-4 shadow-lg flex-shrink-0`}
        >
          {data.icon}
        </motion.div>

        {/* Heading */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
          {data.heading}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed flex-grow">
          {data.description}
        </p>

        {/* Hover Arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          className="mt-4 self-end"
        >
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-r ${data.bgGradient} flex items-center justify-center text-white`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </motion.div>

        {/* Decorative Corner */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${data.bgGradient} opacity-5 rounded-bl-[100px] rounded-tr-2xl`}
        />
      </div>
    </motion.div>
  );
};

const WhyChooseSection = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="relative w-full py-16 md:py-20 bg-gradient-to-br from-blue-400 via-blue-500 to-gray-900 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-[5%] w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[5%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Full Width Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6"
          >
            <HiSparkles className="text-yellow-400" />
            <span className="text-white/80 text-sm font-medium">
              Why Choose Us
            </span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              CV Saathi
            </span>
            ?
          </h2>

          {/* Subheading */}
          <p className="text-gray-50 text-base sm:text-lg max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive analysis to help you
            land your dream job faster than ever.
          </p>
        </motion.div>

        {/* Desktop Cards Grid - Full Width */}
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {cardsData.map((data, index) => (
            <Card key={index} data={data} index={index} />
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          <AnimatePresence>
            {(showAll ? cardsData : cardsData.slice(0, 2)).map((data, index) => (
              <Card key={index} data={data} index={index} />
            ))}
          </AnimatePresence>

          {/* See More/Less Button */}
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
          >
            {showAll ? (
              <>
                See Less <FiChevronUp />
              </>
            ) : (
              <>
                See More <FiChevronDown />
              </>
            )}
          </motion.button>
        </div>

        {/* Stats Row - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {[
            { icon: <FiUsers />, value: "50K+", label: "Active Users" },
            { icon: <FiAward />, value: "98%", label: "Satisfaction" },
            { icon: <FiTrendingUp />, value: "3x", label: "More Interviews" },
            { icon: <FiZap />, value: "<30s", label: "Analysis Time" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg text-cyan-400 mb-2">
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-sm md:text-base text-gray-50">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;