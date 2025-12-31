import React from 'react'
import Navabar from '@/globals/navbar';
import Footer from '@/globals/footer';
const AnalyseCvLayout=({children}:{children:React.ReactNode})=> {
  return (
    <div>
      <Navabar/>
      {children}
      <Footer/>
    </div>
  )
}

export default AnalyseCvLayout;