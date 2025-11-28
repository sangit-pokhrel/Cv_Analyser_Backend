import Navabar from "@/globals/navbar";
import ClientWrapper from "@/globals/Wrapper";
import Footer from "@/globals/footer";
// import { NavWrapper } from "@/globals/Wrapper";
const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
  
        <Navabar />
      
     <ClientWrapper>
          {children}
     </ClientWrapper>
     <Footer />

   
     
      
    </div>
  );
};

export default HomeLayout;
