import React from "react";
import Navabar from "@/globals/navbar";
import Footer from "@/globals/footer";
const AnalyseCVIdLayout =({children}:{children:React.ReactNode})=>{
  return (
    <div>
      <Navabar/>
      {children}
      <Footer/>
    </div>
  )
}
export default AnalyseCVIdLayout