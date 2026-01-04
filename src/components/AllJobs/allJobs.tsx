"use client";
import Section from "@/globals/section";
import React, { useState, useRef } from "react";
import JobCard from "@/globals/jobCard";
import { jobs } from "../JobsPage/dummydata";
import Form from "./form";

const AllJobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  // Mobile carousel refs and state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;

    const cardWidth =
      (slider.children[0] as HTMLElement).clientWidth + 16; // gap-x-4 = 16px
    const index = Math.round(slider.scrollLeft / cardWidth);
    setActiveIndex(index);
  };

  return (
    <Section>
      {/* Heading + Filter Form */}
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col md:flex-row gap-y-2 items-center justify-center gap-x-42">
          <div>
            <h1 className="text-4xl text-center md:text-left font-semibold">
              All Jobs
            </h1>
            <p className="font-extralight text-sm text-gray-500 text-center md:text-left">
              Explore All Opportunities
            </p>
          </div>
          <div className="w-full">
            <Form />
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 place-items-center justify-center gap-y-8 gap-x-8">
          {currentItems.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Desktop Pagination Buttons */}
        <div className="hidden md:flex items-center justify-center gap-2 mt-4">
          <button
            className="Job_category_bg py-1 px-3 rounded-lg cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "font-bold text-black" : ""}
            >
              <p className="py-1 px-3 Job_category_bg rounded-lg">{i + 1}</p>
            </button>
          ))}

          <button
            className="Job_category_bg py-1 px-3 rounded-lg cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden flex flex-col gap-y-10">
          {/* Carousel */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-x-12 w-full scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {currentItems.map((job) => (
              <div key={job.id} className="min-w-[85%] snap-center">
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {currentItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!sliderRef.current) return;
                  const cardWidth =
                    (sliderRef.current.children[0] as HTMLElement)
                      .clientWidth + 16;
                  sliderRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: "smooth",
                  });
                  setActiveIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "bg-blue-500 w-6" : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </div>

          {/* Mobile Pagination Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              className="Job_category_bg py-1 px-3 rounded-lg cursor-pointer"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "font-bold text-black" : ""}
              >
                <p className="py-1 px-3 Job_category_bg rounded-lg">{i + 1}</p>
              </button>
            ))}

            <button
              className="Job_category_bg py-1 px-3 rounded-lg cursor-pointer"
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AllJobs;
