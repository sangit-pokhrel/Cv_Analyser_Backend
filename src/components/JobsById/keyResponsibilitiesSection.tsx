import Section from "@/globals/section"
import { FaCheckCircle } from "react-icons/fa";
const dummyData = ["Design and develop user interface components for web applications using React.js concepts and workflows.","Collaborate with cross-functional teams to define, design, and ship new features.","Optimize components for maximum performance across a vast array of web-capable devices and browsers.","Participate in code reviews to maintain code quality and share knowledge with team members.","Stay updated with the latest industry trends and technologies to ensure our applications remain cutting-edge."];

const KeyResponsibilitiesSection = () => {
  return (
    <Section>
      <div className="border border-gray-400 py-5 px-6 rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-2">Key Responsibilities</h2>
      <div>
        {dummyData.map((point,index)=>{
          return(
            <div key={index}>
              <FaCheckCircle className="inline text-green-500 mr-2"/>
              <span>{point}</span>
            </div>
          )
        })}
      </div>

      </div>
    </Section>
  )
}
export default KeyResponsibilitiesSection;