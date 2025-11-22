import { Metadata } from "next";
import Loginpage from "../../../components/Loginpage_component";

export const metadata:Metadata = {
  title: "Login | Cv Saathi",
  description: "Log in to your Cv Saathi account to access personalized job recommendations, application tracking, and career resources tailored to your profile.",
  icons:"/globe.svg",
}
const Login = () => {
  return <Loginpage />;
}

export default Login;