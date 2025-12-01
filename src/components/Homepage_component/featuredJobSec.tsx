"use client";
import React, { useRef, useEffect, useState } from "react";
import Section from "@/globals/section";
import "@/globals/styles/style.color.css";
import JobCard from "../../globals/jobCard";
import { jobs } from "./dummydata";
import { MdOutlineKeyboardArrowRight,MdOutlineKeyboardArrowLeft } from "react-icons/md";



const FeaturedJobSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check scroll position to enable/disable buttons
  const updateScrollButtons = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    setCanScrollPrev(scrollLeft > 0);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1); 
  };

  // Listen to scroll events
  useEffect(() => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    slider.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons(); // initial check

    return () => slider.removeEventListener("scroll", updateScrollButtons);
  }, [mounted]);

  const slide = (direction: "next" | "prev") => {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.children[0] as HTMLElement;
    if (!firstCard) return;

    const cardWidth =
      firstCard.clientWidth +
      parseInt(getComputedStyle(sliderRef.current).gap || "0");

    const distance = direction === "next" ? cardWidth : -cardWidth;

    sliderRef.current.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  };

  if (!mounted) return null;

  return (
    <Section>
      <div className="flex flex-col gap-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Featured <span className="secondary">Job Opportunities</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Our AI-powered platform provides comprehensive analysis to help land
            your dream job
          </p>
        </div>

        {/* Slider */}
        <div className="relative flex items-center justify-center ">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-scroll scroll-smooth snap-x snap-mandatory px-4 py-4 w-full md:w-[90%]"
            style={{ scrollbarWidth: "none" }}
          >
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Buttons */}
          <button
            onClick={() => slide("prev")}
            disabled={!canScrollPrev}
            className={`absolute top-1/2 left-15 cta_button text-white p-2 rounded-full z-10 hidden md:flex ${
              !canScrollPrev ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <MdOutlineKeyboardArrowLeft size={30}/>
          </button>
          <button
            onClick={() => slide("next")}
            disabled={!canScrollNext}
            className={`absolute top-1/2  right-15 cta_button text-white p-2 rounded-full z-10 hidden md:flex ${
              !canScrollNext ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <MdOutlineKeyboardArrowRight size={30}/>
          </button>
        </div>
      </div>
    </Section>
  );
};

export default FeaturedJobSlider;
