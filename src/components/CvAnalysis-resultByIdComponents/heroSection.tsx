"use client";
import Section from "@/globals/section";
import '@/globals/styles/style.color.css'
import { motion } from "framer-motion";
type ATSScoreProps = {
  overall_Score: number; // 0 - 100
};

const HeroSection = ({ overall_Score }: ATSScoreProps) => {
  const radius = 70;
  const strokeWidth = 10;
  const normalizedScore = Math.min(Math.max(overall_Score, 0), 100);

  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (normalizedScore / 100) * circumference;

  // Dynamic color
  const getColor = (score: number) => {
    if (score >= 80) return "#22C55E"; // green
    if (score >= 60) return "#FACC15"; // yellow
    return "#EF4444"; // red
  };

  // Dynamic description
  const getDescription = (score: number) => {
    if (score >= 80)
      return "Your CV is highly optimized for ATS systems";
    if (score >= 60)
      return "Your CV is moderately optimized for ATS systems";
    return "Your CV needs better ATS optimization";
  };

  return (
   <Section>
     <div className="w-full flex flex-col items-center Overall_CV_Score_bg rounded-xl p-6 shadow-sm border-2  border-blue-200">
      {/* Circle */}
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90deg">
          {/* Background */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={getColor(normalizedScore)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Score */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-orange-500">
            {normalizedScore}%
          </span>
        </div>
      </div>

      {/* Label */}
      <h3 className="mt-4 text-lg font-semibold">
        ATS Score
      </h3>

      {/* Description */}
      <p className="mt-1 text-sm  text-center font-extralight">
        {getDescription(normalizedScore)}
      </p>
    </div>
   </Section>
  );
};

export default HeroSection;
