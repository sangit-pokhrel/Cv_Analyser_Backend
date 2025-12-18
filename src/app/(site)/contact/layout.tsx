import Navabar from '@/globals/navbar';
import React from 'react';
import Footer from '@/globals/footer';
const ContactLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
      <Navabar/>
    {children}
    <Footer/>
    </div>
  )
}

export default ContactLayout;