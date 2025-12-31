import Section from "@/globals/section"
import '@/globals/styles/style.color.css'
import { LuStar } from "react-icons/lu";
import { LiaCheckCircleSolid } from "react-icons/lia";
const ScoreCard = ()=>{
  return(
     <div className=" border border-gray-300  Score_Card_bg px-4 py-6 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-y-2 mb-2">
          <div>
          <LuStar size={30}/>
        </div>
        <div>
          <p className="text-2xl font-semibold text-center">90</p>
          <p className="text-sm font-extralight">Overall Score</p>
        </div>
        </div>
        <div className="pr-4 bg-white border border-gray-200 rounded-2xl">
          <div className="w-[90%] h-2 rounded-2xl cta_button "></div>
        </div>
      </div>
  )
}
const StrongPointsSection =()=>{
  return(
      <div className="flex flex-col gap-y-2  ">
        <div>
        <p className="text-md font-semibold">Strong Points</p>
      </div>
       
       <div>
         <ul className="flex flex-col gap-y-2 text-xs font-extralight">
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2  "><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
        </ul>
       </div>
      </div>
  )
}
const RecommendationSection =()=>{
  return(
      <div className="flex flex-col gap-y-2  ">
        <div>
        <p className="text-md font-semibold">Recommendations</p>
      </div>
       
       <div>
         <ul className="flex flex-col gap-y-2 text-xs font-extralight">
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2  "><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
        </ul>
       </div>
      </div>
  )
}
const QuickWinsSection =()=>{
  return(
      <div className="flex flex-col gap-y-2  ">
        <div>
        <p className="text-md font-semibold">Quick Wins</p>
      </div>
       
       <div>
         <ul className="flex flex-col gap-y-2 text-xs font-extralight">
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2  "><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
          <li className="flex items-center gap-x-2"><LiaCheckCircleSolid size={20}/>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi saepe eos doloremque voluptatibus provident necessitatibus pariatur vero asperiores.</li>
        </ul>
       </div>
      </div>
  )
}


const SampleAnalysisReportSection = ()=>{
  return(
    <Section>
      <div className=" flex flex-col gap-y-4 mb-8">
        <h1 className="text-4xl font-bold text-center">Sample Analysis Report</h1>
      <p className="font-extralight text-xs text-center">See the comprehensive insight and actionalble takeaways include in your personalized report.</p>
      </div>
      <div className="bg-white p-8 border border-gray-300 rounded-lg ">
        <div className="bg-white grid grid-cols-4 gap-x-8 mb-10 ">
       {Array.from({length:4}).map((_,index)=>{
        return(
          <div key={index}>
            <ScoreCard/>
          </div>
        )
       })}
       
      </div>
      <div className="Score_Card_bg pl-8 pr-4 mb-10 rounded-lg pt-4 pb-2 ">
        <StrongPointsSection/>
       </div>
        <div className="Score_Card_bg pl-8 pr-4 mb-10 rounded-lg pt-4 pb-2 ">
        <RecommendationSection/>
       </div>
       <div className="Score_Card_bg pl-8 pr-4 mb-10 rounded-lg pt-4 pb-2 ">
        <QuickWinsSection/>
       </div>
      </div>
    </Section>
  )
}
export default SampleAnalysisReportSection;