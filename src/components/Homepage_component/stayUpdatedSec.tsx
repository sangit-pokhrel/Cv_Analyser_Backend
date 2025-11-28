import { div } from "framer-motion/client"
import Section from "@/globals/section"
import "@/globals/styles/style.color.css"
import { MdMailOutline } from "react-icons/md";
import { BsSend } from "react-icons/bs";


const StayUpdatedSec = ()=>{
  return(
    <Section>
      <div>
      <div className="flex flex-col justify-center items-center gap-y-8 border Stay_updated_section_border md:w-[60%] md:mx-auto py-8 bg-white rounded-lg">
        <div className=" p-6 rounded-full Job_category_bg">
              <MdMailOutline size={40}/>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-4">
          <h2 className="text-3xl font-semibold text-center">Stay Updated With Career Tips</h2>
          <p className="text-xs  font-extralight text-center md:p-0 px-2 ">Get weekly insights on resume optimization, interview tips, and the latest jon opportunities delivered to your inbox</p>
        </div>
        <div className="flex w-[80%] gap-x-4 justify-center items-center">
          <input type="text" className="border border-gray-400 w-full p-2 rounded-lg" placeholder="Enter your Email Here...." />
          <button className="flex gap-x-2 secondary justify-between items-center py-2 px-4 border border-gray-400 rounded-lg  cursor-pointer"><BsSend/><span>Subscribe</span></button>
        </div>
        <p className="text-xs">No spam, unsubscribe anytime. We respect your privacy</p>
      </div>
    </div>
    </Section>
  )
}

export default StayUpdatedSec;