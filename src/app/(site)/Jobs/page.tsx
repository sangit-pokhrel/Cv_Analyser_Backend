import JobsPage from "@/components/JobsPage"
import { Metadata } from "next"
export const metadata:Metadata = {
  
    title: "Jobs | Cv Saathi",
  description: "Welcome to Cv Saathi, your ultimate companion for crafting the perfect CV and landing your dream job. Explore our tools and services designed to enhance your career journey.",
  icons:"/globe.svg",
  
}

const Jobs = ()=>{
  return(
    <JobsPage/>
  )
}
export default Jobs;