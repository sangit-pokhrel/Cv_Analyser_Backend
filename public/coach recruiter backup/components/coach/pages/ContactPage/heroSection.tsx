import { MdOutlineEmail } from "react-icons/md";
import "@/globals/styles/style.color.css"
import Section from "@/globals/section";
const Card = ()=>{
  return(
      <div className=" rounded-lg w-fit flex flex-col gap-y-2 bg-white py-4 px-8  ">
            <div className="flex justify-center items-center ">
              <div className=" p-2 rounded-full Job_category_bg">
                <MdOutlineEmail size={50}/>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h5 className="font-extralight text-xl">Email Us</h5>
              <p className="font-extralight text-xs">Our team typically responds within 24 hours</p>
            </div>
            <div>
              <ul className="flex flex-col gap-y-2">
                {[1,2,3].map((_,index)=>{
                return(
                  <li key={index} className="font-extralight text-sm">Finance: Finance@cvsathi.com</li>
                )
              })}
              </ul>
            </div>
      </div>
  )
}


const HeroSection = ()=>{
  return(
   <Section>
    <div className="flex flex-col gap-y-14">
     <div className="flex flex-col gap-y-3">
      <h1 className="text-4xl font-bold text-center">Get In Touch With US</h1>
      <p className="text-md font-extralight text-center">Have questions? We'd love to here from you. Send us a message and we'll respond as soon as possible</p>
    </div>
    <div className=" flex justify-evenly">
      <Card/>
      <Card/>
      <Card/>
    </div>
   </div>
   </Section>
  )
}
export default  HeroSection;