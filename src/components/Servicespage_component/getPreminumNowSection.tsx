import Section from "@/globals/section"
import "@/globals/styles/style.color.css"

const GetPreminumNowSection = () => {
  return(
      <Section>
        <div className="flex flex-col gap-y-6  py-10 px-12 rounded-xl bg-white  shadow-[5px_5px_2px_rgba(0,0,0,0.1)] ">
          <h2 className="font-bold text-3xl text-center secondary">Doesn't Feel Confidente For Interview ?</h2>
          <p className="text-center text-sm font-extralight">If interviews make you nervous, you're not alone. Many talented individuals struggle to express their skills clearly under pressure. Our platform provides structured guidance, proven strategies, and personalized tips to help you communicate confidentl;y and professionally. With the right preparation, your next interview can be the  stepping stone to the career you've been aming for.</p>
          <div className="flex justify-center items-center">
            
            <button className=" px-14 md:px-24 py-4 cta_button rounded-xl cursor-pointer ">
           <span className="font-bold text-white whitespace-nowrap text-sm md:text-2xl">Get Premium Now</span>
          </button>
          
          </div>
          <p className="text-center text-xs font-extralight">Upgrade risk-free -- you can cancle whenever you want</p>
        </div>
      </Section>
  )
}
export default GetPreminumNowSection;