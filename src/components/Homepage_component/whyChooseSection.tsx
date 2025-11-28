"use client"
import React,{useState} from 'react'
import { FiTarget} from "react-icons/fi";
import Section from '@/globals/section';

interface CardsDataType{
  icon:React.ReactNode
  Heading:string,
  Description:string
};
const  CardsData:CardsDataType[] =[{
  icon:<FiTarget size={20}/>,
  Heading:"Ats Optimization",
  Description:"Ensure your resume passes Applicant Tracking System"
},
{
  icon:<FiTarget size={20}/>,
  Heading:"Ats Optimization",
  Description:"Ensure your resume passes Applicant Tracking System"
},
{
  icon:<FiTarget size={20}/>,
  Heading:"Ats Optimization",
  Description:"Ensure your resume passes Applicant Tracking System"
},
{
  icon:<FiTarget size={20}/>,
  Heading:"Ats Optimization",
  Description:"Ensure your resume passes Applicant Tracking System"
}];

const Cards = ({data}:{data:CardsDataType})=>{
 
  return(
    <div className='bg-white rounded-md md:max-w-[190px] py-4'>
      <div className='flex flex-col gap-y-2 px-4 '>
        <div>
          {data.icon}
        </div>
           <h5 className='font-semibold text-lg'>{data.Heading} </h5>
           <p className='text-sm text-gray-400'>{data.Description}</p>

      </div>
    </div>
  )
}

const WhyChooseSection =()=>{
   const [isSeeMore,setIsSeeMore] = useState(false);
   const handleSeemore =()=>{
    setIsSeeMore(prev=>!prev);
   }
  return(
    <Section>
     
           <div className="flex flex-col gap-y-8 py-6 ">
              <div className="flex flex-col justify-center items-center gap-y-4" >
                <h2 className="text-3xl text-white font-bold">Why Choose Cv Saathi ?</h2>
                <p className=" text-md md:text-xs text-center">Our AI-powered platform provides comprehensive analysis to help land your dream job</p>
              </div>
               {/* Desktop View */}
              <div className=" hidden md:flex justify-center items-center gap-x-10">
                {
                  CardsData.map((data,index)=>
                    <div key={index}>
                      <Cards data={data}/>
                    </div>
                  )
                }

              </div>
               <div className="md:hidden flex flex-col justify-center items-center gap-y-5">
                {
                  !isSeeMore?CardsData.slice(0,1).map((data,index)=>
                    <div key={index}>
                      <Cards data={data}/>
                    </div>
                  ):CardsData.map((data,index)=>
                    <div key={index}>
                      <Cards data={data}/>
                    </div>
                  )
                }
                  <button className='text-white ' onClick={handleSeemore}>{!isSeeMore?"See More...":"See Less"}</button>
              </div>
            </div>
    </Section>
   
  )
}

export default WhyChooseSection;