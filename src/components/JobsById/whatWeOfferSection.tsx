import Section from "@/globals/section"
import { FiCheckSquare } from "react-icons/fi";


const dummyData = ["Competitive salary and benefits package.","Opportunities for professional growth and development.","Flexible working hours and remote work options.","Collaborative and inclusive work environment.","Access to the latest tools and technologies."];
const WhatWeOfferSection = () => {
  return(
    <Section>
      <div className=" border border-white py-5 px-6 rounded-xl bg-[#CDEDFF]">
                <h2 className="text-2xl font-bold mb-2">What We Offer</h2>
                <div>
                 {dummyData.map((point,index)=>{
                     return(
                               <div key={index}>
                                 <FiCheckSquare className="inline text-blue-500 mr-2"/>
                                 <span>{point}</span>
                               </div>
                             )
                 })}
                </div>
     
             </div>
    </Section>    
  )
}

export default WhatWeOfferSection;