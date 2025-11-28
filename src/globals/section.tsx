import React from 'react';

const Section = ({children}:{children:React.ReactNode})=>{
  return(
    <div className='mb-10'>
        {
          children
        }
    </div>
  )
}

export default Section;