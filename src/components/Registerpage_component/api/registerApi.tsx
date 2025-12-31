"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "@/firebase"; 
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";

const registerUser = async (data: any) => {
  try {
//     const res = await axios.post(
//   "http://localhost:5000/api/v1/auth/register",
//   data,
//   {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }
// );

// return res.data;
const userRecord = await createUserWithEmailAndPassword(auth,data.email,data.password);
localStorage.setItem("FirebaseUID",userRecord.user.uid);
localStorage.setItem("Email",data.email)
await sendEmailVerification(userRecord.user,{
  url:'http://localhost:3000/verify-email'
});
//  console.log(res.data);
console.log(auth.currentUser)
// console.log((await auth.currentUser?.getIdTokenResult(true))?.token);
  } catch (error) {
    console.log(error);
  }

 
  
  // console.log(data);
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
