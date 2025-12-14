import Image from "next/image";
import "../globals/styles/style.color.css"
import Registerpage from "@/components/Registerpage_component";
import { Metadata } from "next";
import CVAnalysisPage from "./(site)/Analyse/page";

export const metadata: Metadata = {
  title: "Register | Cv Saathi",
  description: "Create an account on Cv Saathi to access personalized job recommendations, application tracking, and career resources tailored to your profile.",
  icons: "/globe.svg",
};
export default function Home() {
  return (
    // <Registerpage/>
    <CVAnalysisPage />
  );
}
