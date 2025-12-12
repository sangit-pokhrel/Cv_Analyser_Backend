import { FaPlaystation } from "react-icons/fa";
import "@/globals/styles/style.color.css"
const VistCompanyCard = () => {
  return (
    <div className="flex flex-col gap-y-4 border border-gray-400 bg-white py-5 px-6 rounded-xl ">
      <div className="flex items-center gap-x-4">
        <div>
          <FaPlaystation size={50} />
        </div>
        <div>
           <p className="flex items-center gap-x-2 text-lg font-semibold ">Playstation Cooperation</p>
           <p className="text-sm">Baneshwor, Kathmandu, Nepal</p>
          <div className="inline-flex">
            
            <p className="text-xs  px-4 rounded-2xl Job_category_bg ">
              Technology
            </p>
          </div>
        </div>
      </div>
      <hr className="text-gray-400" />
      <div>
        <h2 className="text-md font-bold mb-1">About the Job</h2>
        <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis tenetur, blanditiis reiciendis nobis assumenda ratione at recusandae ducimus nisi sequi tempore! Facere explicabo repellendus libero, velit eius esse itaque quos.</p>
      </div>
       <hr className="text-gray-400" />
       <div>
        <div className="flex gap-x-10">
          <div>
            <p className="text-sm">Application Deadline</p>
            <p className="font-semibold text-lg"> December 05, 2025</p> 
          </div>
          <div>
            <p className="text-sm">Job Posted on</p>
            <p className="font-semibold text-lg"> November 05, 2025</p> 
          </div>
        </div>
        
       </div>
       <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <p>Job Views</p>
            <p>4562</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Applications</p>
            <p>456</p>
          </div>
        </div>
        <div className="flex items-center justify-center mb-8">
          <button className=" text-lg cta_button text-white px-24 py-2 rounded-lg cursor-pointer">Visit Company</button>
        </div>

    </div>
  );
};

export default VistCompanyCard;
