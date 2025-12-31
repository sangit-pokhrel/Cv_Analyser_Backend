'use-client'
import axios from "axios";

const fetchCvAnalysis = async (analysisId: string) => {


 const res = await axios.get(
  `http://localhost:5000/api/v1/cv/analyses/${analysisId}`,
  {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTUzNTdkOWIzNzBmMjRjNzY0ZDgzOGYiLCJyb2xlIjoidXNlciIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzY3MTAxNjU5LCJleHAiOjE3NjcxMTk2NTl9.6gM3GZl4eH0Nb_uGLHXgJ16Rqi8E5U4ZEY88Ktspu34`,
    },
  }
);
console.log(res.data);
  return res.data;


};


export default fetchCvAnalysis;