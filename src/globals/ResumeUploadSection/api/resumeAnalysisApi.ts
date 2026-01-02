'use client'
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import getCookie from "@/globals/getCookie";

const ResumeAnlysisMutationFunc =async (data:any)=>{
  // console.log(data.get('cv'));
  const res = await axios.post('http://localhost:5000/api/v1/cv/analyze',data, {
    headers: {
       Authorization: `Bearer ${getCookie('accessToken')}`,
      "Content-Type": "multipart/form-data",
    },
  });

  localStorage.setItem('CvAnalysisId',res.data.analysisId)
  return res.data


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
 