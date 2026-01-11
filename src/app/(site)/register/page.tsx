import Registerpage from "@/components/Registerpage_component";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Register | Career Sync",
  description: "Create an account on Career Sync to access personalized job recommendations, application tracking, and career resources tailored to your profile.",
  icons: "/globe.svg",
};


const  Register=()=> {
  return <Registerpage/>;
}

export default Register;