"use client"
import React,{useState} from "react";
import Section from "@/globals/section"
import JobCard from "@/globals/jobCard";
import { jobs } from "./dummydata";
import "@/globals/styles/style.color.css"
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const FeaturedJobsSec=()=>{

   

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);


    return(
    <Section>
      <div className="flex flex-col gap-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Featured Jobs
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Our AI-powered platform provides comprehensive analysis to help land
            your dream job
          </p>
        </div>
        {/* Desktop view  */}
         <div className=" hidden md:flex justify-end items-center mr-12 ">
          <Link href={"/Jobs/Alljobs"} className=" cta_button flex flex-row justify-center items-center gap-x-6 px-8 py-3 rounded-lg cursor-pointer" > <p className="text-xl font-semibold">View All Jobs</p> <FaArrowRight/></Link>
        </div>
        <div className="p-4"> 
         
       <div className="hidden md:grid grid-cols-3 place-items-center justify-center  gap-y-8">
              {/* Display items */}
      {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
       </div>

      {/* Pagination buttons */}
      <div className=" hidden md:flex items-center justify-center gap-2 mt-4 ">
        <button className="Job_category_bg py-1 px-3 rounded-lg" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "font-bold text-black" : ""}
          >
            <p className=" py-1 px-3 Job_category_bg  rounded-lg">{i + 1}</p>
          </button>
        ))}

        <button className="Job_category_bg py-1 px-3 rounded-lg" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
          Next
        </button>
      </div>
      </div>

      {/* Mobile view  */}
      <div className="flex flex-col gap-y-10">
        <div className="flex overflow-x-auto snap-mandatory snap-x gap-x-10 w-full " style={{scrollbarWidth:"none"}}>
          {jobs.slice(0,5).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </div>
        <div className=" flex md:hidden justify-end items-center mr-12 ">
          <Link href={"/Jobs/Alljobs"} className=" cta_button flex flex-row justify-center items-center gap-x-6 px-8 py-3 rounded-lg cursor-pointer" > <p className="text-xl font-semibold">View All Jobs</p> <FaArrowRight/></Link>
        </div>
      </div>
      </div>
    </Section>
  )
}

export default FeaturedJobsSec;