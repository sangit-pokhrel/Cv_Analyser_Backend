import React from "react"

export const H1 = ({children,className}:{children:React.ReactNode,className?:string})=>{
    return(
      <h1 className={`text-4xl ${className}`}>
        {children}
      </h1>
    )
}