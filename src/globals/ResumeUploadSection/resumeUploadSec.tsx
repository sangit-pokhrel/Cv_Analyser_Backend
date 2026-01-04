"use client";
import useResumeAnalysisMutation from "./api/resumeAnalysisApi";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";
import { BsFiletypePdf, BsFileWord, BsStars } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

type ResumeForm = {
  cv: File | null;
};

const ResumeUploadSec = () => {
  const AnalyseResumeMutation = useResumeAnalysisMutation();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setValue, handleSubmit } = useForm<ResumeForm>({
    defaultValues: { cv: null },
  });

  /* -------------------- Dropzone -------------------- */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        setValue("cv", uploadedFile, { shouldValidate: true });
        simulateAnalysis();
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  /* -------------------- Fake Progress -------------------- */
  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  /* -------------------- Remove File -------------------- */
  const removeFile = () => {
    setFile(null);
    setValue("cv", null);
    setProgress(0);
    setIsAnalyzing(false);
  };

  /* -------------------- Submit -------------------- */
  const onSubmit = (data: any) => {
    
    const token =getCookie("accessToken");
    if(!token){
        // current full path (including query params)
      const currentUrl =
        pathname + (searchParams.toString() ? `?${searchParams}` : "");

      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    if (!data.cv) return;
    const formData = new FormData();
    formData.append("cv", data.cv);
    AnalyseResumeMutation.mutate(formData);
  };

  return (
    <div className="w-full">
      <form className="flex md:justify-end " onSubmit={handleSubmit(onSubmit)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative md:w-[70%] w-full"
      >
        {/* Glow */}
        <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-lg opacity-25" />

        {/* Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 flex items-center">
            <span className="text-white text-sm font-medium">Resume Analyzer</span>
            <HiSparkles className="ml-auto text-yellow-300" />
          </div>

          {/* Content */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Dropzone */}
                  <div
                    {...getRootProps({
                      className: `border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        isDragActive
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-gray-200 hover:border-cyan-400"
                      }`,
                    })}
                  >
                    <input {...getInputProps()} />
                    <FiUploadCloud className="mx-auto text-4xl text-cyan-500 mb-4" />
                    <p className="text-sm font-semibold">Drop your resume here</p>
                    <p className="text-xs text-gray-400 mb-4">or click to browse</p>
                    <div className="flex justify-center gap-3">
                      <span className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded">
                        <BsFiletypePdf /> PDF
                      </span>
                      <span className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded">
                        <BsFileWord /> DOC
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* File Info */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiFile />
                    <div className="flex-1 truncate">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    {!isAnalyzing && (
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>

                  {/* Progress */}
                  {(isAnalyzing || progress > 0) && (
                    <div>
                      <div className="flex justify-between text-xs">
                        <span>{progress < 100 ? "Analyzing..." : "Complete"}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded">
                        <div
                          className="h-full bg-linear-to-r from-cyan-500 to-blue-600 rounded"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  {progress === 100 && (
                    <button
                    disabled={AnalyseResumeMutation.isPending}
                      type="submit"
                      className="w-full mt-2 bg-cyan-600 text-white py-2 rounded-lg cursor-pointer"
                    >
                      {AnalyseResumeMutation.isPending?"Just a Moment...":"View Analysis"}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Icon */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute -top-3 -right-3 bg-orange-500 p-2 rounded-xl"
        >
          <BsStars className="text-white" />
        </motion.div>
      </motion.div>
    </form>
    </div>
  );
};

export default ResumeUploadSec;
