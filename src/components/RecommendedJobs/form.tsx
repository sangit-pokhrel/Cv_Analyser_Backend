"use client"
import { useForm } from "react-hook-form"

type FormType = {
  Title:string,
  Location:string,
  Category:string
}
const Form = ()=>{

    const {register,handleSubmit,formState:{errors},watch}=useForm<FormType>();

    const onSubmit = (data:FormType)=>{
      console.log(data);
    }
       


      return(
         <form action="" onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center gap-x-10">
                <div className="flex flex-col">
                  <label htmlFor="Title">Job Titile</label>
                  <input {...register("Title",{required:true})} type="text" id="Title" className="border border-gray-400 px-2 py-2 rounded-md bg-white" placeholder="Senior Software Developer" />
                </div>
             <div className="flex flex-col">
                  <label htmlFor="Location">Location</label>
                  <input {...register("Location",{required:true})} type="text" id="Location" className="border border-gray-400 px-2 py-2 rounded-md bg-white" placeholder="Kathmandu" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Category">Category</label>
                  <input {...register("Category",{required:true})} type="text" id="Category" className="border border-gray-400 px-2 py-2 rounded-md bg-white" placeholder="On-Site" />
                </div>
              </form>
      )

}
export default Form;