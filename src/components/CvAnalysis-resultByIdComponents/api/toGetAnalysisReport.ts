'use-client'
import axios from "axios";
import getCookie from "@/globals/getCookie";
const fetchCvAnalysis = async (analysisId: string) => {


 const res = await axios.get(
  `https://amused-celinka-nothingname-3b1ecdef.koyeb.appapi/v1/cv/analyses/${analysisId}`,
  {
    headers: {
      Authorization: `Bearer ${getCookie('accessToken')}`,
    },
  }
);
console.log(res.data);
  return res.data;


};


export default fetchCvAnalysis;