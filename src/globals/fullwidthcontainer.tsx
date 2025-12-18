
import React from "react"
import Container from "./container"
import "@/globals/styles/style.color.css"
const FullWidthContainer= ({children}:{children:React.ReactNode})=>{
  return(
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen fullwidthcontainer_bg md:px-0 px-6 ">
     
        {children}
    

</div>

  )
}


export default FullWidthContainer;