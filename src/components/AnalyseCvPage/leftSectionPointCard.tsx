import { HiOutlineBolt } from "react-icons/hi2";
import '@/globals/styles/style.color.css'
const LeftSectionPointCard = ()=>{
  return (
    <div className="flex border border-gray-300 bg-white justify-center items-center gap-x-2 py-2 px-3 rounded-lg">
      <div className=" p-2 rounded-full Job_category_bg">
            <HiOutlineBolt size={20}/>
      </div>
      <div>
        <p className="text-sm font-semibold">Instant Analysis</p>
      </div>
    </div>
  )
}
export default LeftSectionPointCard;