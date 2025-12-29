import { Metadata } from "next";
import ContactIndex from "@/components/coach/pages/ContactPage";
export const metadata:Metadata  ={
  title:"Contact page",
  description:"To contact us call 12365478910",

} 
  const ContactPage = () => {
  return (
      <ProtectedRoute>

        <ContactIndex/>
      </ProtectedRoute>

   
  )
}

export default ContactPage;