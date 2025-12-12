
import { IoInformationCircle } from "react-icons/io5";
const dummyData = ["Bachelor's degree in Computer Science or related field.","3+ years of experience in software development.","Proficiency in JavaScript, React, and Node.js.","Strong understanding of RESTful APIs and web services.","Excellent problem-solving skills and attention to detail."];
const RequirementsSection = () => {
  return(
   
        <div className="mb-5">
           <h2 className="text-2xl font-bold mb-2">Requirements</h2>
           <div>
            {dummyData.map((point,index)=>{
                return(
                          <div key={index}>
                            <IoInformationCircle className="inline text-blue-500 mr-2"/>
                            <span>{point}</span>
                          </div>
                        )
            })}
           </div>

        </div>
     
  )
}
export default RequirementsSection;