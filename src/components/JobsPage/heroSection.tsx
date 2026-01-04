import Section from "@/globals/section"
import { CiSearch} from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import "@/globals/styles/style.color.css"
import Form from "./form";

const HeroSection = ()=>{
  return(
    
    <Section>
     <div className="flex flex-col  items-center justify-center gap-y-10 w-full ">
             <div className="flex flex-col gap-y-2 items-center justify-center">
               <h1 className="text-4xl text-center ">
                 Find Your Dream Job Today
               </h1>
               <p className="font-extralight text-sm text-gray-500 text-center">Join thousands of professionals who found their dream jobs</p>
             </div>
             <div>
              <div className="bg-white md:pl-10 md:pr-24 px-10 py-8 rounded-lg">
                <Form/>
              </div>
             </div>
     
             
           </div>
      </Section>
  )
}
export default HeroSection;