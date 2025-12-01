"use client"

import Section from "@/globals/section"
import { useState,useRef,useEffect } from "react";
import { H1 } from "@/globals/typography"
import { MdOutlineComputer } from "react-icons/md";
import { SlArrowRight } from "react-icons/sl";
import "@/globals/styles/style.color.css"
import { MdOutlineKeyboardArrowRight,MdOutlineKeyboardArrowLeft } from "react-icons/md";

type CardType = {
  Category: string;
  Noofopenings: number;
};

const CardData: CardType[] = [
  {
    Category: "Engineering",
    Noofopenings: 4
  },
  {
    Category: "Marketing",
    Noofopenings: 2
  },
  {
    Category: "Marketing",
    Noofopenings: 2
  }, {
    Category: "Marketing",
    Noofopenings: 2
  },
   {
    Category: "Marketing",
    Noofopenings: 2
  },
   {
    Category: "Marketing",
    Noofopenings: 2
  },
];


const Card = ({data}:{data:CardType})=>{
   
  return(
    <div className="flex justify-between items-center gap-x-24 bg-white px-6 py-4 rounded-xl snap-center">
      <div className="flex gap-x-2 justify-center items-center ">
        <div className="Job_category_bg p-3 rounded-xl">
            <MdOutlineComputer size={40}/>
        </div>
        <div>
            <h5 className="text-xl font-semibold">{data.Category}</h5>
            <p className="text-xs">{data.Noofopenings} Open Positions</p>
        </div>
      </div>
      <div>
            <a href=""><SlArrowRight /></a>
      </div>
    </div>
  )
}

const BrowseByCategory = ()=>{
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
  return(
      <Section>
        <div className="flex flex-col gap-y-8">
          <div>
            <div className="flex flex-col items-center justify-between gap-y-2">
             <H1>
              Browse By Category
             </H1>
             <p className="font-extralight text-sm text-gray-500">Explore opportunities By Your field</p>
            </div>
        </div>
        {/* Slider */}
        <div className="relative flex items-center justify-center ">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-scroll scroll-smooth snap-x snap-mandatory px-4 py-4 w-full md:w-[95%]"
            style={{ scrollbarWidth: "none" }}
          >
            {CardData.map((data,index) => (
              <div key={index}>
                <Card data={data}/>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <button
            onClick={() => slide("prev")}
            disabled={!canScrollPrev}
            className={`absolute top-1/3 -left-5 cta_button text-white p-2 rounded-full z-10 hidden md:flex ${
              !canScrollPrev ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <MdOutlineKeyboardArrowLeft size={30}/>
          </button>
          <button
            onClick={() => slide("next")}
            disabled={!canScrollNext}
            className={`absolute top-1/3  -right-5 cta_button text-white p-2 rounded-full z-10 hidden md:flex ${
              !canScrollNext ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <MdOutlineKeyboardArrowRight size={30}/>
          </button>
        </div>
        </div>
      </Section>
  )
}

export default BrowseByCategory;