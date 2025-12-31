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
  
    

        <HeroSection />

        <FullWidthContainer>
          <WhyChooseSection />
        </FullWidthContainer>

        <FeaturedJobSec />

        <StayUpdatedSec />
   
    </Container>
  );
};

export default Homepage_component;
