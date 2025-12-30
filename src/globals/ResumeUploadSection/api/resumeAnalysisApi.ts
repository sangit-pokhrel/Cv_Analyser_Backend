'use client'
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

const ResumeAnlysisMutationFunc =async (data:any)=>{
  // console.log(data.get('cv'));
  const res = await axios.post('http://localhost:5000/api/v1/cv/analyze',data, {
    headers: {
       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTUzNTdkOWIzNzBmMjRjNzY0ZDgzOGYiLCJyb2xlIjoidXNlciIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzY3MTAxNjU5LCJleHAiOjE3NjcxMTk2NTl9.6gM3GZl4eH0Nb_uGLHXgJ16Rqi8E5U4ZEY88Ktspu34`,
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(res.data);
  localStorage.setItem('CvAnalysisId',res.data.analysisId)
  return res.data

  // console.log((await auth.currentUser?.getIdTokenResult(true))?.token);
}

export const useResumeAnalysisMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ResumeAnlysisMutationFunc,
    onSuccess:()=>{
      router.push(`cv/analysis-result/${localStorage.getItem('CvAnalysisId')}`)
    }
  });
};


export default useResumeAnalysisMutation;
 