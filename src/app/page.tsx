import Image from "next/image";
import "../globals/styles/style.color.css"
import Navabar from "@/globals/navbar";
import Footer from "@/globals/footer";
// Removed incorrect import for Metadata
import HomeLayout from "./(site)/home/layout";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Homepage_component from "@/components/Homepage_component";

export const metadata: Metadata = {
  title: "Register | Cv Saathi",
  description: "Create an account on Cv Saathi to access personalized job recommendations, application tracking, and career resources tailored to your profile.",
  icons: "/globe.svg",
};
export default function Home() {
  return (
    <div>
      <Navabar/>
      <Homepage_component />
      <Footer/>
    </div>
     

  
  );
}
