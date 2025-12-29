"use client"
import {useForm} from 'react-hook-form';
import { LuSend } from "react-icons/lu";
import "@/globals/styles/style.color.css"
type formData = {
  fullName:string,
  email:string,
  subject:string,
  message:string
}

const Form = ()=>{
    const {register,handleSubmit,formState:{errors}}=useForm<formData>();
    const onSubmit = (data:formData)=>{
        console.log(data);
    }
  return(
    <div className='w-[60%] bg-white p-6 rounded shadow-2xl '>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div  className='flex flex-col gap-y-8'>
          <div>
            <h4 className='font-bold text-2xl'>
           Send Us a Message 
        </h4>
        <p className='font-extralight text-sm '>Fill out form below and we'll get back to you within 24 hours</p>
          </div>
        <div className='flex flex-col gap-y-6'>
          <div className='flex flex-col gap-y-1'>
            <label htmlFor="FullName" className='text-lg font-extralight'>Full Name</label>
          <input {...register("fullName",{required:true})} type="text" id='FullName' className='border-2 border-gray-300 px-4 py-2 rounded' /> 
          </div>
        <div className='flex flex-col gap-y-1'>
            <label htmlFor="Email" className='text-lg font-extralight'>Email</label>
          <input {...register("email",{required:true})} type="text" id='Email' className='border-2 border-gray-300 px-4 py-2 rounded' />  
        </div>
        <div className='flex flex-col gap-y-1'> 
            <label htmlFor="Subject" className='text-lg font-extralight'>Subject</label>
          <input {...register("subject",{required:true})} type="text" id='Subject ' className='border-2 border-gray-300 px-4 py-2 rounded' />
         
        </div>
          <div className='flex flex-col gap-y-1'>
             <label htmlFor="Message" className='text-lg font-extralight'>Message</label>
            <textarea className='border-2 border-gray-300 resize-none px-4 py-2 rounded' {...register("message",{required:true})} id="message" name="message" rows={4} cols={50} placeholder="Type something here...">
</textarea>
          </div>
           </div >
          <div className='flex justify-center items-center'>
             <button type='submit' className=' py-2 w-[40%] rounded-lg flex justify-center items-center gap-x-2 cta_button cursor-pointer'><LuSend className='text-white'/><span className='text-white'>Send Message</span></button>
          </div>
        </div>

    </form>
    </div>
  )
}
export default Form;