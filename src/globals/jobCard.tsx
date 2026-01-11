"use client"
import { motion } from "framer-motion";
import { Job } from "../components/Homepage_component/types";
import { BsFileEarmarkPdf } from "react-icons/bs";
import "@/globals/styles/style.color.css"
import Link from "next/link";


const JobCard = ({ job }: { job: Job }) => {
  return (
    <motion.div
      className="shrink-0 w-xs  md:w-[300px]  py-4 px-3 bg-white border border-gray-400 rounded-xl shadow-md snap-center"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
     <div className="flex  justify-between items-start">
      <div className="flex items-end justify-start gap-x-2 mt-4">
      <div className="border secondary px-2 py-1 rounded-md">
        <BsFileEarmarkPdf size={35}/>
      </div>
      <p className="text-xs font-extralight  px-1 rounded-2xl Job_category_bg ">{job.category}</p>
     </div>

        <div>
          <p className="text-xs font-extralight text-red-500">Deadline : {job.deadline}</p>
          <p className="text-xs font-extralight">Job Posted : {job.postedDate}</p>
        </div>

     </div>
     <div className="grid gap-y-3 mt-1">
        <div>
          <h3 className="text-lg font-bold">{job.title}</h3>
        <h5 className="text-sm">{job.company}</h5>
        </div>
        <div>
          <p><span className="text-sm font-light">Location:</span> {job.location}</p>
          <p> <span className="text-sm font-light">Expereience:</span> {job.experienceYears}</p>
          <p> <span className="text-sm font-light">Position:</span> {job.positionType} {job.isOnsite?"(is Onsite)":"(is Remote)"}</p>
          <p><span className="text-sm font-light">Salary:</span> {job.salary}</p>
          <p><span className="text-sm font-light">No. of Openings:</span> {job.openings}</p>
        </div>
        <Link href={`/jobs/${job.id}`}><button className="cta_button_secondary w-full py-2 rounded-xl cursor-pointer"><span className="text-white text-lg font-normal">View Details</span></button></Link>
     </div>
    </motion.div>
  );
};
export default  JobCard;