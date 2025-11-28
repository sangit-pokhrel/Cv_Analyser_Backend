"use client";
import React from "react";
import Container from "@/globals/container";
import { RiGeminiLine } from "react-icons/ri";
import Badge from "@/globals/badge";
import HeroSection from "./herosection";
import FullWidthContainer from "@/globals/fullwidthcontainer";
import WhyChooseSection from "./whyChooseSection";
import FeaturedJobSec from "./featuredJobSec";
import StayUpdatedSec from "./stayUpdatedSec";
const Homepage_component = () => {
  return (
    <Container>
      <div>
        <div className="flex justify-center mb-10">
          <Badge
            icon={<RiGeminiLine className="inline mr-1 mb-1 text-blue-500" />}
          >
            AI-Powred Analysis
          </Badge>
        </div>

        <HeroSection />

        <FullWidthContainer>
          <WhyChooseSection />
        </FullWidthContainer>

        <FeaturedJobSec />

        <StayUpdatedSec />
      </div>
    </Container>
  );
};

export default Homepage_component;
