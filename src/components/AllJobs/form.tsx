"use client"
import { useEffect } from "react"
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
         <form action="" onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-3 grid-cols-1 md:gap-y-0 gap-y-4 justify-center place-items-start md:gap-x-10 gap-x-0 ">
                <div className="flex flex-col w-full ">
                  <label htmlFor="Title">Job Titile</label>
                  <input {...register("Title",{required:true})} type="text" id="Title" className="border border-gray-400 px-2 py-2 rounded-md bg-white" placeholder="Senior Software Developer" />
                </div>
             <div className="flex flex-col w-full">
                  <label htmlFor="Location">Location</label>
                  <input {...register("Location",{required:true})} type="text" id="Location" className="border border-gray-400 px-2 py-2 rounded-md bg-white" placeholder="Kathmandu" />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="Category">Category</label>
                  <input {...register("Category",{required:true})} type="text" id="Category" className="border border-gray-400 px-2 py-2 rounded-md bg-white" placeholder="On-Site" />
                </div>
              </form>
      )

}
export default Form;