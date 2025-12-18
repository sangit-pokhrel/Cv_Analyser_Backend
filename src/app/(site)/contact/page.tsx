import { Metadata } from "next";
import ContactIndex from "@/components/ContactPage";
export const metadata:Metadata  ={
  title:"Contact page",
  description:"To contact us call 12365478910",

} 
  const ContactPage = () => {
  return (
    <ContactIndex/>
  )
}

export default ContactPage;