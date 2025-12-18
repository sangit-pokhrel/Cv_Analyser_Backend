
import Section from "@/globals/section"
const HersoSection =()=>{
  return(
     <Section>
      <div className="flex flex-col gap-y-10 md:gap-y-18">
       <div>
        <h1 className="text-4xl font-bold mb-2 text-center">About Cv</h1>
       <p className="text-center text-md font-extralight">Empowering job seekers with intelligent CV analysis and career optimization tools</p>
       </div>
       <div className="flex flex-col  gap-y-4 ">
          <h3 className="text-3xl font-medium ">Our Story</h3>
        <div className="flex flex-col md:flex-row md:gap-x-10 md:gap-y-0 gap-y-8 ">
        
         <div className=" w-full md:w-[50%] text-justify">
           
           <p className=" text-lg font-extralight ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius et nemo cum voluptatum, dolorum, nihil in, atque quis praesentium laudantium magni fugiat harum tenetur alias ipsa. Vel, esse dolore. Porro. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad esse rerum officiis dicta excepturi, ex quaerat libero tempora iure molestiae perferendis, nesciunt labore id sint quam, autem facilis porro assumenda.</p>
         </div>
         <div className=" w-full md:w-[50%]">
          
           <div className="flex flex-col  gap-x-5 gap-y-4  bg-white rounded-2xl p-8 shadow-[-6px_0_0px_rgba(23,174,255,1)]">
             <div className="flex gap-x-4 ">
              <img src="/logo.jpg" alt="Photo" className="w-32 h-24 border rounded-2xl" />
             <div>
                <h5 className=" text-lg font-extralight">GhanaShyam Bhai</h5>
                <p className="text-lg font-extralight">Founder & CEO</p>
              </div>
             </div>
            <div className="flex flex-col">
             
              
              <div>
                <p className=" text-md font-extralight"><span className="font-bold">"</span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima eveniet quod nulla dolor nobis ad voluptatibus accusamus recusandae necessitatibus quam beatae voluptate labore ipsa accusantium dignissimos consequuntur, unde impedit aperiam.<span className="font-bold">"</span></p>
              </div>
              
            </div>
           </div>
         </div>
        </div>
       </div>
     </div>
     </Section>
  )
}

export default HersoSection;