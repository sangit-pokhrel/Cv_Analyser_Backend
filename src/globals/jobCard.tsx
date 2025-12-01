"use client"
import { motion } from "framer-motion";
import { Job } from "../components/Homepage_component/types";
import { BsFileEarmarkPdf } from "react-icons/bs";
import "@/globals/styles/style.color.css"


const JobCard = ({ job }: { job: Job }) => {
  return (
    <motion.div
      className="shrink-0 w-xs  md:w-[300px]  p-4 bg-white border border-gray-400 rounded-xl shadow-md snap-center"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
     <div className="flex items-center justify-between">
      <div className="flex items-end justify-start gap-x-2 ">
      <div className="border secondary px-2 py-1 rounded-md">
        <BsFileEarmarkPdf size={35}/>
      </div>
      <p className="text-xs  px-1 rounded-2xl Job_category_bg ">{job.category}</p>
     </div>

        <div>
          <p className="text-xs">Deadline : {job.deadline}</p>
          <p className="text-xs">Job Posted : {job.postedDate}</p>
        </div>

     </div>
     <div className="grid gap-y-3">
        <div>
          <h3 className="text-lg font-bold">{job.title}</h3>
        <h5 className="text-sm">{job.company}</h5>
        </div>
        <div>
          <p><span className="text-sm font-semibold">Location:</span> {job.location}</p>
          <p> <span className="text-sm font-semibold">Expereience:</span> {job.experienceYears}</p>
          <p> <span className="text-sm font-semibold">Position:</span> {job.positionType} {job.isOnsite?"(is Onsite)":"(is Remote)"}</p>
          <p><span className="text-sm font-semibold">Salary:</span> {job.salary}</p>
          <p><span className="text-sm font-semibold">No. of Openings:</span> {job.openings}</p>
        </div>
        <a href=""><button className="cta_button_secondary w-full py-2 rounded-xl cursor-pointer"><span className="text-white text-lg font-semibold">View Details</span></button></a>
     </div>
    </motion.div>
  );
};
export default  JobCard;