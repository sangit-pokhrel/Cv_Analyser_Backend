"use client"
import Container from "@/globals/container";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import Herosection from "./heroSection";
import AboutJobSection from "./aboutSection";
import KeyResponsibilitiesSection from "./keyResponsibilitiesSection";
import RequirementsSection from "./requirementsSection";
import PlusPointsSection from "./plusPointsSection";
import WhatWeOfferSection from "./whatWeOfferSection";
import VistCompanyCard from "./visitCompanyCard";
const JobsDetails = ()=>{
  return(
   <Container>
     <div className="flex mb-4">
      <Link href="/jobs/all" className="flex items-center justify-center gap-2"><FaArrowLeft size={12}/><p className="text-sm">Back to Jobs</p></Link>
      
    </div>
    <div>
        <Herosection/>
      </div>
      <div className="flex md:flex-row flex-col items-start justify-between">
        <div className="md:w-[55%]">
          <AboutJobSection/>
        <KeyResponsibilitiesSection/>
        <div className="border border-gray-400 py-5 px-6 rounded-xl bg-white mb-10 ">
          <RequirementsSection/>
          <PlusPointsSection/>
        </div>
        <WhatWeOfferSection/>
        </div>
        <div className="md:w-[40%]">
          <VistCompanyCard/>
        </div>
      </div>
   </Container>
  )
}

export default JobsDetails;