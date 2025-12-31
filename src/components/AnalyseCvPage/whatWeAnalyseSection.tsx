import { IoDocumentAttachOutline } from "react-icons/io5";
import { LiaCheckCircleSolid } from "react-icons/lia";
import '@/globals/styles/style.color.css'
import Section from "@/globals/section";

const Card = ()=>{
  return(
    <div className="w-full flex flex-col gap-y-2 bg-white pl-6 pr-8 py-4 border border-gray-300 rounded-lg">
      <div className=" w-fit p-5 rounded-full cta_button">
        <IoDocumentAttachOutline size={30}/>
      </div>
      
      <div className="flex flex-col gap-y-2">
        <div>
        <p className="text-md font-semibold">Professional Summary</p>
      </div>
       
       <div>
         <ul className="flex flex-col gap-y-2 text-xs font-extralight">
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Clarity and impact</li>
          <li className="flex items-center gap-x-2  "><LiaCheckCircleSolid size={20}/>Keyword optiization</li>
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Value proposition</li>
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Length and structure</li>
        </ul>
       </div>
      </div>

    </div>
  )
}

const WhatWeAnalyseSection = ()=>{
  return(
   <Section>
     <div className="flex flex-col gap-y-12">
      <div>
        <h1 className="text-4xl font-bold text-center">What We Analyse?</h1>
      <p className="font-extralight text-xs text-center">Our analysis focuses on essential elements that reaveal patterns and oppurtunities.</p>
      </div>
      <div className="grid grid-cols-4  place-items-center gap-x-8 ">
         {Array.from({length:4}).map((_,index)=> {
          return(
            <div key={index} className="w-full">
              <Card/>
            </div>
          )
         })}
      </div>
    </div>
   </Section>
  )
}
export default WhatWeAnalyseSection;