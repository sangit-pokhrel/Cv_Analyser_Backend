"use client"
import React,{useState} from "react";
import Section from "@/globals/section"
import JobCard from "@/globals/jobCard";
import { jobs } from "./dummydata";
import "@/globals/styles/style.color.css"
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useRef } from "react";

const FeaturedJobsSec=()=>{
   const sliderRef = useRef<HTMLDivElement>(null);
   const [activeIndex, setActiveIndex] = useState(0);
   const mobileViewJob =jobs.slice(0,5);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const updateScrollButtons = () => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = slider;


    //  Detect active card
    const cardWidth =
      (slider.children[0] as HTMLElement)?.clientWidth +
      parseInt(getComputedStyle(slider).gap || "0");

    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(index);
  };
  const ScrollEvent =() => {
      if (!sliderRef.current) return;

      const slider = sliderRef.current;
      const cardWidth =
        (slider.children[0] as HTMLElement).clientWidth + 16; // gap-x-4 = 16px

      const index = Math.round(slider.scrollLeft / cardWidth);
      setActiveIndex(index);
    }


    return(
    <Section>
      <div className="flex flex-col gap-y-6">
        <div className="flex justify-between text-center">
          <div>
            <h2 className="text-3xl font-bold">
            Featured Jobs
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Explore opportunities By Your field
          </p>
          </div>
          <div className=" hidden md:flex justify-end items-center ">
          <Link href={"/Jobs/all"} className=" cta_button flex flex-row justify-center items-center gap-x-6 px-8 py-3 rounded-lg cursor-pointer" > <p className="text-xl font-semibold">View All Jobs</p> <FaArrowRight/></Link>
        </div>
        </div>
        {/* Desktop view  */}
         
        <div className="flex flex-col justify-center items-center " > 
         
       <div className="hidden md:grid grid-cols-3 justify-items-stretch gap-y-8  w-full">
              {/* Display items */}
      {currentItems.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
       </div>

      {/* Pagination buttons */}
      <div className=" hidden md:flex items-center justify-center gap-2 mt-4">
        <button className="Job_category_bg py-1 px-3 rounded-lg  cursor-pointer " onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
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

        <button className="Job_category_bg py-1 px-3 rounded-lg cursor-pointer inline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
          Next
        </button>
      </div>
      </div>

     
      {/* MOBILE VIEW */}
<div className="md:hidden flex flex-col gap-y-5">

  {/* SLIDER */}
  <div
    ref={sliderRef}
    onScroll={ScrollEvent}
    className="flex overflow-x-auto snap-x snap-mandatory gap-x-10 w-full scroll-smooth"
    style={{ scrollbarWidth: "none" }}
  >
    {mobileViewJob.map((job) => (
      <div key={job.id} className="min-w-[85%] snap-center">
        <JobCard job={job} />
      </div>
    ))}
    
  </div>
  {/* DOTS */}
  <div className="flex justify-center gap-2 mt-4">
    {mobileViewJob.map((_, index) => (
      <button
        key={index}
        onClick={() => {
          if (!sliderRef.current) return;

          const cardWidth =
            (sliderRef.current.children[0] as HTMLElement).clientWidth + 16;

          sliderRef.current.scrollTo({
            left: index * cardWidth,
            behavior: "smooth",
          });

          setActiveIndex(index);
        }}
        className={`h-2 rounded-full transition-all duration-300 ${
          activeIndex === index
            ? "bg-blue-500 w-6"
            : "bg-gray-300 w-2"
        }`}
      />
    ))}
  </div>

  {/* VIEW ALL */}
  <div className="flex justify-end items-center mr-12">
    <Link
      href="/jobs/all"
      className="cta_button flex gap-x-6 px-8 py-3 rounded-lg"
    >
      <p className="text-xl font-semibold">View All Jobs</p>
      <FaArrowRight />
    </Link>
  </div>

  
</div>

      </div>
    </Section>
  )
}

export default FeaturedJobsSec;