"use client"
import Container from "@/globals/container";
import Badge from "@/globals/badge";
import { IoBagCheckOutline } from "react-icons/io5";
import HeroSection from "./heroSection";
import BrowseByCategory from "./browseByCategory";
import FullWidthContainer from "@/globals/fullwidthcontainer";
import WhySection from "./whySection";
import FeaturedJobsSec from "./featuredJobsSec";
const JobsPage=()=>{
  return (  
   <Container>
     <div className="flex justify-center items-center mb-10">
          <Badge
            icon={<IoBagCheckOutline className="inline mr-1 mb-1 text-blue-500" />}
          >
            1000+ Jobs Available
          </Badge>
        </div>

        <HeroSection/>
        <BrowseByCategory/>
        <FullWidthContainer>
            <WhySection/>
        </FullWidthContainer>
        <FeaturedJobsSec/>
   </Container>

  )
}
export default JobsPage