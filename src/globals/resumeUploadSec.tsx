
import { BsUpload } from "react-icons/bs";


const ResumeUploadSec =()=>{
  return(
     <div className="border border-gray-400 border-dashed flex flex-col gap-y-5 justify-center items-center p-8 rounded-xl bg-white">
          <div>
            <BsUpload size={50} className="font-normal text-black" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <h4 className="text-xl font-semibold text-black">Drop Your Resume Here</h4>
            <p className="text-normal font-extralight text-black">
              Supports the document up-to max of 5mb and supports pdf and docx
            </p>
          </div>
          <div className="flex items-center w-full">
            <hr className="grow border-gray-300" />
            <span className="px-4 ">OR</span>
            <hr className="grow border-gray-300" />
          </div>

          <div className="">
            <button className="cursor-pointer flex  justify-center items-center gap-x-4 cta_button text-white py-2 px-4 rounded-xl">
              <BsUpload size={20}/>
              <p className="text-xl">Upload Cv/Resume</p>
            </button>
          </div>
        </div>
  )
}

export default ResumeUploadSec;