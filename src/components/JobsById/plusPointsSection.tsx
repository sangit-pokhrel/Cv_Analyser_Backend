
import { IoIosAddCircle } from "react-icons/io";

const dummyData = ["Competitive salary and benefits package.","Opportunities for professional growth and development.","Flexible working hours and remote work options.","Collaborative and inclusive work environment.","Access to the latest tools and technologies."];
const PlusPointsSection = () => {
  return(
   
        <div>
                 <h2 className="text-2xl font-bold mb-2">Plus Points</h2>
                 <div>
                  {dummyData.map((point,index)=>{
                      return(
                                <div key={index}>
                                  <IoIosAddCircle className="inline text-blue-500 mr-2"/>
                                  <span>{point}</span>
                                </div>
                              )
                  })}
                 </div>
      
              </div>
   
  )
}
export default PlusPointsSection;