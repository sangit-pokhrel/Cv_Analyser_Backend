'use client'

import React from "react";
import getCookie from "./getCookie";




const ProtectedRoute =({children}:{children:React.ReactNode})=>{

  const token = getCookie('accessToken');
  if(token){
    return (<div>
      {children}
    </div>)
  }
  else {
    window.location.href='/login';
  }
  

}

export default ProtectedRoute;