"use client";
import Section from "@/globals/section";
import React, { useState } from "react";
import JobCard from "@/globals/jobCard";
import { jobs } from "../JobsPage/dummydata";
import Container from "@/globals/container";
import Form from "./form";

const RecommendedJobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  return (
    <Section>
      <div className="flex flex-col gap-y-10  ">
        <div className="flex   gap-y-2 items-center justify-center gap-x-12">
          <div>
            <h1 className="text-4xl whitespace-nowrap text-center font-semibold ">Recommended Jobs</h1>
          <p className="font-extralight text-sm text-gray-500">
            Explore All Opportunities
          </p>
          </div>
          <div>
            <Form />
          </div>
        </div>

        <div className="hidden md:grid grid-cols-3 place-items-center justify-center  gap-y-8">
          {/* Display items */}
          {currentItems.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Pagination buttons */}
        <div className=" hidden md:flex items-center justify-center gap-2 mt-4 ">
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
              <p className=" py-1 px-3 Job_category_bg  rounded-lg">{i + 1}</p>
            </button>
          ))}

          <button
            className="Job_category_bg py-1 px-3 rounded-lg cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
        {/* Mobile view  */}
        <div className="md:hidden flex flex-col gap-y-10">
          <div
            className="flex overflow-x-auto snap-mandatory snap-x gap-x-4 w-full "
            style={{ scrollbarWidth: "none" }}
          >
            {jobs.slice(0, 5).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
export default RecommendedJobs;
