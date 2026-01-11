"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Container from "@/globals/container";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import fetchCvAnalysis from "./api/toGetAnalysisReport";
import { CvAnalysisResponse } from "./type";
import "@/globals/styles/style.color.css";
import Link from "next/link";
import { MdOutlineFileDownload } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import React, { useState } from "react";
import HeroSection from "./heroSection";
import Section from "@/globals/section";
import AiRecommendationsSection from "./aiRecommendationsSection";
import ExtractedSkillsSection from "./extractedSkillSection";
import { motion } from "framer-motion";
import { GoShareAndroid } from "react-icons/go";
import { handleWhatsAppShare } from "@/globals/ShareFuncLogics";

const AnalyseCvIdIndex = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const analysisId = params.id as string;

  const { data, isLoading, isError, error } = useQuery<CvAnalysisResponse>({
    queryKey: ["cv-analysis", analysisId],
    queryFn: () => fetchCvAnalysis(analysisId),
    enabled: !!analysisId,

    refetchInterval: (query) => {
      const { data, status } = query.state;

      // Stop polling if the request itself failed
      if (status === "error") return false;

      // Poll if we have no data yet, or if status is processing
      if (!data?.data || data.data.status === "processing") {
        return 5000;
      }

      return false;
    },
  });

  console.log(data);
  console.log(analysisId);

  // Loading state
  if (isLoading || data?.data.status === "processing") {
    return (
      <Container>
        <div
          role="status"
          className="flex flex-col justify-center items-center"
        >
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
      <Section>
        <div className="">
          <div className="flex md:flex-row flex-col md:gap-y-0 gap-y-8 justify-between items-start ">
            <div>
              <h1 className="text-4xl font-bold">CV Analysis Results</h1>
              <p className="text-sm font-extralight">
                Comprehensive analysis of your resume with AI recommendations
              </p>
            </div>
            <div className="flex justify-center items-center gap-x-4">
              <button className="cursor-pointer rounded-lg text-xs font-extralight cta_button_secondary text-white px-6 md:px-10 py-3 ">
                <Link href="/home ">Back to Home</Link>
              </button>
              <button className="cursor-pointer  rounded-lg text-xs font-extralight bg-blue-600 text-white px-10 py-2 ">
                <Link
                  className="flex justify-center items-end gap-x-2"
                  href="/home "
                >
                  <MdOutlineFileDownload size={20} />
                  <span>Download</span>
                </Link>
              </button>
              <motion.div
                className="p-0.5 rounded-md border relative"
                onHoverStart={() => setOpen(true)}
                onHoverEnd={() => setOpen(false)}
              >
                <GoShareAndroid size={25} className="cursor-pointer" />
                <motion.div
                  className="flex flex-col absolute border"
                  animate={open ? "open" : "closed"}
                  variants={{
                    closed: {
                      opacity: 0,
                      scale: 0.2,
                      y: 3,
                      x: 5,
                      pointerEvents: "none",
                    },
                    open: {
                      opacity: 1,
                      scale: 1,
                      y: 3,
                      x: 5,
                      pointerEvents: "auto",
                      transition: { duration: 0.3, ease: "easeInOut" },
                    },
                  }}
                >
                  <Link href="">Facebook</Link>
                  <Link href="">Instagram</Link>
                  <Link href="" onClick={handleWhatsAppShare}>
                    Whatsapp
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
          {/* Analyse cv result here!
        <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      </Section>
      <HeroSection overall_Score={data?.data?.overallScore || 0} />
      <AiRecommendationsSection
        recommendations={data?.data?.recommendations || []}
      />
      <ExtractedSkillsSection Skills={data?.data?.skillsDetected || []} />
    </Container>
  );
};

export default AnalyseCvIdIndex;
