"use client";
import React, { useRef, useEffect, useState } from "react";
import ServiceCard from "./servicesCard";
import Section from "@/globals/section";
const OurServicesSectionMobileView = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    
    const slider = sliderRef.current;
    const scrollLeft = slider.scrollLeft;
    const itemWidth = slider.offsetWidth;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveIndex(index);
  };

  const scrollToSection = (index: number) => {
    if (!sliderRef.current) return;
    const itemWidth = sliderRef.current.offsetWidth;
    
    sliderRef.current.scrollTo({
      left: index * itemWidth,
      behavior: "smooth",
    });
  };

  return (
    <Section>
      {/* Container with snapping */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide md:hidden"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {Array.from({length:3}).map((_, index) => (
          <div key={index} className="w-full shrink-0 snap-center px-4">
           
               <ServiceCard/>
         
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6 md:hidden">
        {[1, 2, 3].map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`h-2 transition-all duration-300 rounded-full ${
              activeIndex === index ? "bg-blue-600 w-6" : "bg-gray-300 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Section>
  );
};

export default OurServicesSectionMobileView;