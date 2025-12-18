"use client";
import Section from "@/globals/section";
import "@/globals/styles/style.color.css";
import React, { useRef, useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { FaStar } from "react-icons/fa";

const dummyData = [
  {
    name: "Jane Doe",
    position: "Junior Developer at TechCorp",
    img: "/success1.png",

    description:
      "Jane, a stay-at-home mom with no prior tech experience, decided to pivot her career. Through dedication and online courses, she landed a role as a junior developer at a leading tech firm within a year.",
  },
  {
    name: "John Smith",
    position: "Data Analyst at DataSolutions",
    img: "/success2.png",

    description:
      "John, a former marketing professional, discovered his passion for data. By enrolling in a data analytics bootcamp and building a strong portfolio, he successfully transitioned into a data analyst role.",
  },
  {
    name: "Emily Johnson",
    position: "UX Designer at CreativeStudio",
    img: "/success3.png",

    description:
      "Emily, originally a graphic designer, wanted to explore user experience design. After completing a UX design course and networking within the industry, she secured a position at a renowned creative studio.",
  },
   {
    name: "Om Shah",
    position: "UX Designer at CreativeStudio",
    img: "/success3.png",

    description:
      "Emily, originally a graphic designer, wanted to explore user experience design. After completing a UX design course and networking within the industry, she secured a position at a renowned creative studio.",
  },
  
];

const Card = ({
  name,
  position,
  img,
  description,
}: {
  name: string;
  position: string;
  img: string;
  description: string;
}) => {
  return (
    <div className="flex items-center justify-center w-full md:w-[50%] shrink-0 ">
      <div className=" py-6 px-4 flex flex-col items-start justify-center gap-y-2 rounded-xl  snap-center w-[90%] md:w-[96%] bg-white ">
        <div className="flex gap-x-2 px-4 ">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i}>
              <FaStar className="rating_color" size={20} />
            </div>
          ))}
        </div>
        <div className=" flex flex-col gap-y-8  p-4">
          <p className="text-md ">
            <span className="font-bold">"</span>{" "}
            <span className="font-extralight">{description}</span>{" "}
            <span className="font-bold">"</span>
          </p>
          <div className="flex items-center mb-4">
            <img
              src={img}
              alt={name}
              className="w-18 h-18 border rounded-full mr-3"
            />
            <div>
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="text-sm text-gray-500">{position}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessStoriesSection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check scroll position to enable/disable buttons
  const updateScrollButtons = () => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = slider;

    setCanScrollPrev(scrollLeft > 0);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);

    // 🔹 Detect active card
    const cardWidth =
      (slider.children[0] as HTMLElement)?.clientWidth +
      parseInt(getComputedStyle(slider).gap || "0");

    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(index);
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
      <div className="flex flex-col gap-y-4">
        <div>
          <h1 className="font-bold text-4xl secondary text-center">Success Stories</h1>
          <p className="font-extralight text-sm text-center">
            Every story here represents a journey challenges overcome, goals
            acheived and creers transformed
          </p>
        </div>
        {/* Slider */}
        <div className="relative flex w-full  ">
          <div
            ref={sliderRef}
            className="flex gap-1 overflow-x-scroll scroll-smooth snap-x snap-mandatory  py-4  md:w-full"
            style={{ scrollbarWidth: "none" }}
          >
            {dummyData.map((story, index) => (
              <Card
                key={index}
                name={story.name}
                position={story.position}
                img={story.img}
                description={story.description}
              />
            ))}
          </div>

          {/* Buttons */}
          <button
            onClick={() => slide("prev")}
            disabled={!canScrollPrev}
            className={`absolute top-1/2 -left-9 cta_button text-white p-2 rounded-full z-10 hidden md:flex ${
              !canScrollPrev
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <MdOutlineKeyboardArrowLeft size={30} />
          </button>
          <button
            onClick={() => slide("next")}
            disabled={!canScrollNext}
            className={`absolute top-1/2  -right-9 cta_button text-white p-2 rounded-full z-10 hidden md:flex ${
              !canScrollNext
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <MdOutlineKeyboardArrowRight size={30} />
          </button>
        </div>
        {/* Dots */}
        <div className="flex md:hidden  justify-center gap-2 mt-4">
          {dummyData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!sliderRef.current) return;
                const cardWidth =
                  (sliderRef.current.children[0] as HTMLElement).clientWidth +
                  parseInt(getComputedStyle(sliderRef.current).gap || "0");

                sliderRef.current.scrollTo({
                  left: index * cardWidth,
                  behavior: "smooth",
                });
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-blue-500 w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default SuccessStoriesSection;
