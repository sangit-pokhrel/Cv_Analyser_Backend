import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.js";

const signInWithGoogle = async () =>{
   
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      window.location.href = "/home";
    } catch (error) {
      console.log("Error during sign in with Google:", error);
    
  };
} 

export default signInWithGoogle;




