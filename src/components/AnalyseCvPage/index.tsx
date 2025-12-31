'use client'
import Container from "@/globals/container";
import Badge from "@/globals/badge";
import { RiGeminiLine } from "react-icons/ri";
import HeroSection from "./heroSection";
import WhatWeAnalyseSection from "./whatWeAnalyseSection";
import SampleAnalysisReportSection from "./sampleAnalysisReportSection";
import PowerfulAnalysisFeatureSection from "./powerfulAnalysisFeaturesSection";
const AnalyseCvIndex = () => {
  return (
    <Container>
       <div className="flex justify-start items-center mb-6 ">
          <Badge
            icon={<RiGeminiLine className="inline mr-1 mb-1 text-blue-500" />}
          >
            AI-Powred Analysis
          </Badge>
        </div>
        <HeroSection/>
        <WhatWeAnalyseSection/>
        <SampleAnalysisReportSection/>
        <PowerfulAnalysisFeatureSection/>
    </Container>
  );
};
export default AnalyseCvIndex;
