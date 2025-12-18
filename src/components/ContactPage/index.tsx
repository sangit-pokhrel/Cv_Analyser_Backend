import Container from "@/globals/container";
import Badge from "@/globals/badge";
import { CiChat1 } from "react-icons/ci";
import HeroSection from "./heroSection";
import Form from "./form";
import { CiClock2 } from "react-icons/ci";
import ConnectWithUsSection from "./connectWithUsSection";
import "@/globals/styles/style.color.css"
import Section from "@/globals/section";
import FAQSection from "./faqSection";
const ContactIndex = ()=>{
  return(
   <Container>
     <div className="flex justify-center items-center mb-3  ">
          <Badge
            icon={<CiChat1 className="inline  text-black" size={20} />}
          >
            <span className="font-extralight text-sm">We're Here To Help</span>
          </Badge>
        </div>

        <HeroSection/>
        <Section>
          <div className="flex items-start justify-between gap-x-12">
          <Form/>
         <div className="flex flex-col gap-y-8 w-[40%]">
           <ConnectWithUsSection/>
          <div className="flex flex-col gap-y-6 bg-white rounded-lg  p-6 border-2 border-gray-300  ">
            <div className="flex gap-x-4">
            <div className=" cta_button w-fit  px-3 py-2 rounded flex justify-center items-center ">
                <CiClock2 color="white" size={30}/>
                
            </div>
            <div>
                  <h5 className="font-semibold text-md">Quick Response Time</h5>
                  <p className="text-xs font-extralight">Our support team typiacally responss within 24 hours during bussiness days</p>
                </div>
          </div>
          <div className="flex gap-x-4">
            <div className=" cta_button w-fit  px-3 py-2 rounded flex justify-center items-center ">
                <CiClock2 color="white" size={30}/>
                
            </div>
            <div>
                  <h5 className="font-semibold text-md">Quick Response Time</h5>
                  <p className="text-xs font-extralight">Our support team typiacally responss within 24 hours during bussiness days</p>
                </div>
          </div>
          </div>
         </div>
        </div>
       
        </Section>
         <FAQSection/>
   </Container>
  )
}

export default ContactIndex;