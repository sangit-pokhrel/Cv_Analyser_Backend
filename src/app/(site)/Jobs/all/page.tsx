
import AllJobsIndex from "@/components/AllJobs";
import { Metadata } from "next";

export const metadata:Metadata = {
  title:"All Jobs For You",
  icons:"/globe.svg",
}
const AllJobsPage = ()=>{
  return(
    <AllJobsIndex/>
  )
}
export default AllJobsPage;