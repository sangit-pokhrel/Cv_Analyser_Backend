"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Container from "@/globals/container";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import fetchCvAnalysis from "./api/toGetAnalysisReport";
import { CvAnalysisResponse } from "./type";

const AnalyseCvIdIndex = () => {
  const queryClient = useQueryClient();

  const params = useParams();
  const analysisId = params.id as string;

const { data, isLoading, isError, error } = useQuery<CvAnalysisResponse>({
  queryKey: ["cv-analysis", analysisId],
  queryFn: () => fetchCvAnalysis(analysisId),
  // enabled: !!analysisId,
  

refetchInterval: (query) => {
  const { data, status } = query.state;

  // Stop polling if the request itself failed
  if (status === 'error') return false;

  // Poll if we have no data yet, or if status is processing
  if (!data?.data || data.data.status === "processing") {
    return 5000;
  }

  return false;
}


});


  


  console.log(data);
  console.log( analysisId )

  // Loading state
  if (isLoading || data?.data.status === "processing") {
  return (
    <Container>
      <div role="status" className="flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xl">Loading... Please Wait!</span>
      </div>
    </Container>
  );
}


  // Error state
  if (isError) {
    return (
      <Container>
        <p>Error: {(error as any)?.message}</p>
      </Container>
    );
  }
 

  // Data loaded
  return (
    <Container>
      <div>
        Analyse cv result here!
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </Container>
  );
};

export default AnalyseCvIdIndex;
