'use client'

import React from "react";
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}




const ProtectedRoute =({children}:{children:React.ReactNode})=>{

  const token = getCookie('Token');
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