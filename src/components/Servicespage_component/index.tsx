import Container from "@/globals/container";
import HeroSection from "./heroSection";
import ServiceCard from "./servicesCard";
import Section from "@/globals/section";
import GetPreminumNowSection from "./getPreminumNowSection";
import OurServicesSectionMobileView from "./ourServicesSectionMobileView";
const ServicesIndex = ()=>{
  return(
    <Container>
      <HeroSection />
      
       <Section>
        <div className=" hidden md:grid grid-cols-3 gap-y-8  mt-15">
         <ServiceCard/>
         <ServiceCard/>
         <ServiceCard/>
         <ServiceCard/>
         
       </div>
       
      
            <OurServicesSectionMobileView/>
       
      
       </Section>
       <GetPreminumNowSection/>
     
    </Container>
  )
}

export default ServicesIndex;