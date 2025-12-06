"use client"
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useForm } from "react-hook-form";
import "@/globals/styles/style.color.css";
import {toast} from "sonner"
type FormType= {
  email:string
}
const ResetPasswordIndex = () => {
  const {register,handleSubmit,formState:{errors}}=useForm<FormType>();
  const onSubmit =async (data:FormType)=>{
    try {
      
      await sendPasswordResetEmail(auth,data.email);
      toast.success("Password reset email sent Successfully");
    } catch (error) {
      toast.error("Unsuccessful to send password reset email");
    }
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <div className=" w-xl py-12 bg-white rounded-2xl ">
        <form action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center gap-y-8">
            <div className="flex flex-col gap-y-2 items-center justify-center">
              <h1 className="text-3xl font-semibold ">Forgot Your Password?</h1>
            <h5>Verify your idnetity to begin the password reset process.</h5>
            </div>
            <input {...register("email",{required:true})} type="text" className="py-4 px-4 w-[80%] rounded-xl Job_Search_Input_bg focus:outline-none " placeholder="Enter your email here ..." />
            {errors.email?.message && <p>Invalid Input</p>}
            <button type="submit" className=" px-8 py-2 rounded-4xl cta_button cursor-pointer">Get Password Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordIndex;
