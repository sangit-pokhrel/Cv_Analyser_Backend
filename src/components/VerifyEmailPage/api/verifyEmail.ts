import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth } from "@/firebase";
import { getAuth } from "firebase/auth";

const VerifyEmailMutationFunc =async (data:any)=>{
  // const res = await axios.post('http://localhost:5000/api/v1/auth/login',data, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // document.cookie = `Token=${res.data.accessToken}`;

  // return res.data

  // console.log((await auth.currentUser?.getIdTokenResult(true))?.token);
  // localStorage.setItem("Email Verified","verified");
  console.log("Email Verified");
}

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: VerifyEmailMutationFunc,
  });
};


export default useVerifyEmailMutation;