
import React from "react"
import "@/globals/styles/style.color.css"
const FullWidthContainer= ({children}:{children:React.ReactNode})=>{
  return(
    <div className="w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] fullwidthcontainer_bg ">
      {children}

</div>

  )
}


export default FullWidthContainer;