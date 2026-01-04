import Section from "@/globals/section";
import { FaEye } from "react-icons/fa";
import "@/globals/styles/style.color.css";

const Card = () => {
  return (
    <div className="bg-white px-5 py-4 rounded-lg">
      <div className="w-fit p-3 rounded-lg mb-2 Job_category_bg">
        <FaEye size={30} />
      </div>
      <div className="flex flex-col gap-y-2">
        <h4 className="text-md font-semibold">AI-Powered Analysis</h4>
        <p className="text-sm font-extralight">
          Advanced AI evaluates your resume against industry standards and best practices
        </p>
      </div>
    </div>
  );
};

const PowerfulAnalysisFeatureSection = () => {
  return (
    <Section>
      <div className="flex flex-col gap-y-12">
        {/* Heading */}
        <div className="flex flex-col gap-y-2">
          <h1 className="text-4xl font-bold text-center">
            Powerful Analysis Features
          </h1>
          <p className="font-extralight text-xs text-center">
            Everything you need to create a Job winning CV.
          </p>
        </div>

        {/* 📱 MOBILE CAROUSEL */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory md:hidden px-4 pb-4" style={{scrollbarWidth:"none"}}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[80%] snap-center"
            >
              <Card />
            </div>
          ))}
        </div>

        {/* 🖥 DESKTOP VIEW */}
        <div className="hidden md:flex gap-x-8 justify-center" >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Card />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default PowerfulAnalysisFeatureSection;
