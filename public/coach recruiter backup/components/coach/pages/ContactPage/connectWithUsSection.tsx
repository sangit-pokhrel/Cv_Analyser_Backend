import { FiFacebook } from "react-icons/fi";
import "@/globals/styles/style.color.css"
const ConnectWithUsSection  = ()=>{
    return(
      <div className=" flex flex-col items-start justify-start gap-y-4 pl-4 pr-2 pt-4 pb-8 rounded-lg bg-white border-2 border-gray-300 " >
        <div className="flex flex-col gap-y-2">
          <h5 className="font-bold text-lg">Connect With Us</h5>
          <p className="font-extralight text-sm">Follow us on social media for tips, updates, and crees advice</p>
        </div>
        <div className=" flex gap-x-6 items-center ">
          <div className=" p-2 rounded-lg Job_category_bg">
          <FiFacebook size={30}/>
        </div>
        <div className=" p-2 rounded-lg Job_category_bg">
          <FiFacebook size={30}/>
        </div>
        <div className=" p-2 rounded-lg Job_category_bg">
          <FiFacebook size={30}/>
        </div>
        <div className=" p-2 rounded-lg Job_category_bg">
          <FiFacebook size={30}/>
        </div>
        </div>
      </div>
    )
}

export default ConnectWithUsSection;