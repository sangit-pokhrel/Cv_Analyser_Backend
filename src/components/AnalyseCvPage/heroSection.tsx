import React from "react";
import "@/globals/styles/style.color.css";
import { HiOutlineBolt } from "react-icons/hi2";
import { FiTarget } from "react-icons/fi";
import ResumeUploadSec from "@/globals/ResumeUploadSection/resumeUploadSec";
import Section from "@/globals/section";
import "@/globals/styles/style.color.css"
import LeftSectionPointCard from "./leftSectionPointCard";

const HeroSection = () => {
  return (
    <Section>
          <div className="grid md:grid-cols-2 grid-cols-1 justify-between palce-items-start md:gap-y-0 gap-y-8 ">
      {/* left Section */}
      <div className="flex flex-col  items:center md:items-start justify-center gap-y-10">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-4xl md:w-[50%] font-bold">
            Get Expert CV{" "}
            <span className="font-extrabold text-blue-500">Analysis {" "}</span>
            <span>Seconds</span>
          </h1>
          <p className="font-extralight text-sm text-gray-500 ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
            laboriosam, aperiam praesentium rem, dolorem ea quam laborum id
            magni voluptas voluptate necessitatibus dolore laudantium!
            Praesentium recusandae nesciunt ab magnam molestias.
          </p>
        </div>

        {/* Left Section Points Card  */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {Array.from({length:4}).map((_,index)=>{
            return(
              <div key={index}>
                <LeftSectionPointCard/>
              </div>
            )
          })}
        </div>
       
      </div>

      {/* Right Section */}
      <div className="flex ">
       <ResumeUploadSec/>
      </div>
    </div>
    </Section>
        
  );
};
export default HeroSection;
