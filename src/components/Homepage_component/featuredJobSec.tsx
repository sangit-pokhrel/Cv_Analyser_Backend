// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import Section from "@/globals/section";
// import "@/globals/styles/style.color.css";
// import JobCard from "../../globals/jobCard";
// import { jobs } from "./dummydata";
// import { MdOutlineKeyboardArrowRight,MdOutlineKeyboardArrowLeft } from "react-icons/md";



// const FeaturedJobSlider = () => {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [mounted, setMounted] = useState(false);
//   const [canScrollPrev, setCanScrollPrev] = useState(false);
//   const [canScrollNext, setCanScrollNext] = useState(true);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Check scroll position to enable/disable buttons
//   const updateScrollButtons = () => {
//     if (!sliderRef.current) return;
//     const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

//     setCanScrollPrev(scrollLeft > 0);
//     setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1); 
//   };

//   // Listen to scroll events
//   useEffect(() => {
//     if (!sliderRef.current) return;
//     const slider = sliderRef.current;
//     slider.addEventListener("scroll", updateScrollButtons);
//     updateScrollButtons(); // initial check

//     return () => slider.removeEventListener("scroll", updateScrollButtons);
//   }, [mounted]);

//   const slide = (direction: "next" | "prev") => {
//     if (!sliderRef.current) return;
//     const firstCard = sliderRef.current.children[0] as HTMLElement;
//     if (!firstCard) return;

//     const cardWidth =
//       firstCard.clientWidth +
//       parseInt(getComputedStyle(sliderRef.current).gap || "0");

//     const distance = direction === "next" ? cardWidth : -cardWidth;

//     sliderRef.current.scrollBy({
//       left: distance,
//       behavior: "smooth",
//     });
//   };

//   if (!mounted) return null;

//   return (
//     <Section>
//       <div className="flex flex-col gap-y-6">
//         <div className="text-center">a
//           <h2 className="text-3xl font-bold">
//             Featured <span className="secondary">Job Opportunities</span>
//           </h2>
//           <p className="text-xs text-gray-500 mt-1">
//             Our AI-powered platform provides comprehensive analysis to help land
//             your dream job
//           </p>
//         </div>

//         {/* Slider */}
//         <div className="relative flex w-full  ">
//           <div
//             ref={sliderRef}
//             className="flex gap-4 overflow-x-scroll scroll-smooth snap-x snap-mandatory  py-4  md:w-full"
//             style={{ scrollbarWidth: "none" }}
//           >
//             {jobs.map((job) => (
//               <JobCard key={job.id} job={job} />
//             ))}
//           </div>

//           {/* Buttons */}
//           <button
//             onClick={() => slide("prev")}
//             disabled={!canScrollPrev}
//             className={`absolute top-1/2 -left-9 cta_button text-white p-2 rounded-full z-10 hidden md:flex ${
//               !canScrollPrev ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
//             }`}
//           >
//             <MdOutlineKeyboardArrowLeft size={30}/>
//           </button>
//           <button
//             onClick={() => slide("next")}
//             disabled={!canScrollNext}
//             className={`absolute top-1/2  -right-9 cta_button text-white p-2 rounded-full z-10 hidden md:flex ${
//               !canScrollNext ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
//             }`}
//           >
//             <MdOutlineKeyboardArrowRight size={30}/>
//           </button>
//         </div>
//       </div>
//     </Section>
//   );
// };

// export default FeaturedJobSlider;


"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiDollarSign,
  FiBookmark,
  FiArrowRight,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

// Job type definition
interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  posted: string;
  tags: string[];
  featured?: boolean;
}

// Dummy data
const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/120px-Google_%22G%22_Logo.svg.png",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $180k",
    experience: "3-5 years",
    posted: "2 days ago",
    tags: ["React", "TypeScript", "Node.js"],
    featured: true,
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/120px-Facebook_Logo_%282019%29.png",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $150k",
    experience: "2-4 years",
    posted: "3 days ago",
    tags: ["Figma", "UI/UX", "Prototyping"],
    featured: true,
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/120px-Amazon_logo.svg.png",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130k - $190k",
    experience: "4-6 years",
    posted: "1 day ago",
    tags: ["Python", "AWS", "Microservices"],
    featured: false,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/120px-Microsoft_logo.svg.png",
    location: "Remote",
    type: "Full-time",
    salary: "$110k - $160k",
    experience: "3-5 years",
    posted: "5 days ago",
    tags: ["Docker", "Kubernetes", "CI/CD"],
    featured: false,
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/120px-Netflix_2015_logo.svg.png",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$140k - $200k",
    experience: "3-5 years",
    posted: "1 week ago",
    tags: ["Python", "ML", "TensorFlow"],
    featured: true,
  },
  {
    id: 6,
    title: "Mobile Developer",
    company: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/120px-Apple_logo_black.svg.png",
    location: "Cupertino, CA",
    type: "Full-time",
    salary: "$150k - $220k",
    experience: "4-6 years",
    posted: "3 days ago",
    tags: ["Swift", "iOS", "SwiftUI"],
    featured: true,
  },
];

// Job Card Component
const JobCard = ({ job, index }: { job: Job; index: number }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={{ 
        y: -8,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      }}
      className="group relative flex-shrink-0 w-[300px] sm:w-[340px]"
    >
      {/* Card Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.2 }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur"
      />

      {/* Card */}
      <div className="relative bg-white rounded-2xl p-5 shadow-lg border border-gray-100 h-full transition-shadow duration-300 group-hover:shadow-2xl">
        {/* Featured Badge */}
        {job.featured && (
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.2 + index * 0.08 }}
            className="absolute -top-2 -right-2 z-10"
          >
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <HiSparkles className="text-yellow-200" />
              Featured
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 flex-shrink-0"
          >
            <img
              src={job.logo}
              alt={job.company}
              className="w-full h-full object-contain"
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg leading-tight truncate group-hover:text-cyan-600 transition-colors duration-300">
              {job.title}
            </h3>
            <p className="text-gray-500 text-sm">{job.company}</p>
          </div>

          <motion.button
            onClick={() => setIsBookmarked(!isBookmarked)}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isBookmarked
                ? "bg-cyan-50 text-cyan-600"
                : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <FiBookmark
              className={`transition-all duration-200 ${isBookmarked ? "fill-current" : ""}`}
              size={18}
            />
          </motion.button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: FiMapPin, text: job.location, color: "text-cyan-500" },
            { icon: FiBriefcase, text: job.type, color: "text-cyan-500" },
            { icon: FiDollarSign, text: job.salary, color: "text-green-500" },
            { icon: FiClock, text: job.posted, color: "text-amber-500" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-500 text-sm">
              <item.icon className={`${item.color} flex-shrink-0`} size={14} />
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Divider & Button */}
        <div className="border-t border-gray-100 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-shadow duration-300"
          >
            Apply Now
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <FiArrowRight />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Smooth Navigation Button
const NavButton = ({ 
  direction, 
  onClick, 
  disabled 
}: { 
  direction: "prev" | "next"; 
  onClick: () => void; 
  disabled: boolean;
}) => {
  const Icon = direction === "prev" ? MdOutlineKeyboardArrowLeft : MdOutlineKeyboardArrowRight;
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 
        items-center justify-center z-20 hidden md:flex
        transition-all duration-300
        ${disabled 
          ? "opacity-30 cursor-not-allowed" 
          : "hover:shadow-2xl hover:bg-gray-50 cursor-pointer"
        }
      `}
    >
      <motion.div
        animate={!disabled ? { x: direction === "next" ? [0, 3, 0] : [0, -3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <Icon className="text-gray-700" size={28} />
      </motion.div>
    </motion.button>
  );
};

// Main Slider Component
const FeaturedJobSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  
  // Spring-based scroll position for Mac-like smoothness
  const scrollX = useMotionValue(0);
  const springScrollX = useSpring(scrollX, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateScrollButtons = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollPrev(scrollLeft > 5);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const handleScroll = () => {
      updateScrollButtons();
      scrollX.set(container.scrollLeft);
    };
    
    container.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollButtons();
    
    return () => container.removeEventListener("scroll", handleScroll);
  }, [mounted, scrollX]);

  // Mac-like smooth slide function
  const slide = (direction: "next" | "prev") => {
    if (!containerRef.current) return;
    
    const cardWidth = 340 + 24; // card width + gap
    const currentScroll = containerRef.current.scrollLeft;
    const targetScroll = direction === "next" 
      ? currentScroll + cardWidth 
      : currentScroll - cardWidth;
    
    // Smooth scroll with easing
    const startTime = performance.now();
    const duration = 600; // ms
    const startScroll = currentScroll;
    
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      
      if (containerRef.current) {
        containerRef.current.scrollLeft = startScroll + (targetScroll - startScroll) * easedProgress;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  if (!mounted) return null;

  return (
    <section className="relative w-full py-16 md:py-20  overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10 px-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-full mb-4"
          >
            <FiBriefcase className="text-cyan-600" />
            <span className="text-cyan-700 text-sm font-medium">Latest Openings</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Featured{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Job Opportunities
            </span>
          </h2>

          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Discover your next career move from top companies hiring now
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 lg:left-8 z-20">
            <NavButton direction="prev" onClick={() => slide("prev")} disabled={!canScrollPrev} />
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 lg:right-8 z-20">
            <NavButton direction="next" onClick={() => slide("next")} disabled={!canScrollNext} />
          </div>

          {/* Slider Track */}
          <div className="px-4 sm:px-6 md:px-16 lg:px-20 xl:px-24">
            <motion.div
              ref={containerRef}
              className="flex gap-6 overflow-x-auto py-6 px-2 -mx-2 scroll-smooth"
              style={{ 
                scrollbarWidth: "none", 
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {jobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}

              {/* View All Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                className="flex-shrink-0 w-[300px] sm:w-[340px]"
              >
                <div className="h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl min-h-[320px]">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4"
                  >
                    <FiArrowRight className="text-white text-2xl border border-gray-400" />
                  </motion.div>
                  <h3 className="text-white text-xl font-bold mb-2">Explore All Jobs</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Browse 1000+ opportunities waiting for you
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="px-6 py-2.5 bg-white text-cyan-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    View All Jobs
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Gradient Fades */}
          <div className="absolute top-0 left-0 w-12 md:w-20 h-full pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-12 md:w-20 h-full pointer-events-none z-10" />
        </div>

        {/* Progress Dots - Mobile */}
        <div className="flex justify-center gap-1.5 mt-6 md:hidden">
          {jobs.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300"
              whileInView={{ backgroundColor: i === 0 ? "#06b6d4" : "#d1d5db" }}
            />
          ))}
        </div>

        {/* Swipe Hint - Mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-2 mt-4 md:hidden"
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1 text-gray-400 text-sm"
          >
            <span>Swipe to explore</span>
            <MdOutlineKeyboardArrowRight />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedJobSlider;