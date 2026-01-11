"use client";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import Section from "@/globals/section";



type AiRecommendationsSectionProps = {
 recommendations: string[] ;
};

const AiRecommendationsSection = ({
  recommendations,
}: AiRecommendationsSectionProps) => {
  return (
    <Section>
      <div className="flex flex-col gap-y-4">
        {recommendations?.map((recommendation,index)=>{
        return(
          <div key={index} className="flex flex-col  gap-x-5 gap-y-4  bg-white rounded-2xl p-8 shadow-[-6px_0_0px_rgba(23,174,255,1)] border-2 border-gray-300 border-l-0">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <p className=" text-md font-extralight">
              {recommendation}
            </p>
            <div className="text-blue-500"><IoMdCheckmarkCircleOutline size={25}/></div>
          </div>
        </div>
      </div>
        )
      })}
      </div>
    </Section>
  );
};
export default AiRecommendationsSection;
