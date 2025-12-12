import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.js";
import { toast } from "sonner";
import { getIdToken } from "firebase/auth";

const signInWithGoogle = async () =>{
   
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const token =await getIdToken(result.user,true);
      document.cookie = `firebaseToken=${token}: path=/;`;
      window.location.href = "/home";
    } catch (error) {
      console.log("Error during sign in with Google:", error);
      toast.error("Google sign in unsuccessful")
    
  };
} 

export  const signInWithFacebook = async () =>{
   
    const provider = new FacebookAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      window.location.href = "/home";
    } catch (error) {
      console.log("Error during sign in with Facebook:", error);
      toast.error("Facebook sign in unsucccessful");
    
  };
} 

export default signInWithGoogle;




