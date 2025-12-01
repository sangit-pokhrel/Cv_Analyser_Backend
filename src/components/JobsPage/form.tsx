import { p } from "framer-motion/client";
import {useForm} from "react-hook-form";
import { CiSearch} from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
interface formType {
  Title:string,
  Location:string
}
const Form =()=>{
   const {register,handleSubmit,formState:{errors}}=useForm<formType>();
   
   const onSubmit = (data:formType)=>{
    
    console.log(data);
    
  
  }
    return(

       <form action="" onSubmit={handleSubmit(onSubmit)} className="flex md:flex-row flex-col gap-10">
                        <div  className="flex flex-col items-center justify-center" >
                          <div className="flex items-center justify-center">
                            <CiSearch size={30}/>
                          <input {...register("Title",{required:true})} type="text" placeholder="Job Title, Keywords..." className=" p-3 Job_Search_Input_bg rounded-lg text-lg  focus:outline-none" />
                          </div>
                          {errors.Title && <p className="text-red-500">Invalid Input </p>}
                        </div>
                        <div  className="flex flex-col items-center justify-center" >
                          <div className="flex items-center justify-center">
                            <IoLocationOutline size={30}/>
                          <input {...register("Location",{required:true})} type="text" placeholder="Job Title, Keywords..." className=" p-3 Job_Search_Input_bg rounded-lg text-lg focus:outline-none" />
                          </div>
                          {errors.Location && <p className="text-red-500">Invalid Input </p>}
                        </div>
                      
                       <button type="submit" className="flex items-center justify-center gap-2 py-4  md:px-6 md:py-0  rounded-4xl cta_button  font-semibold"><CiSearch size={20}/><span className="text-md ">Search Jobs</span></button>
                      </form>

  )
}
export default Form;



