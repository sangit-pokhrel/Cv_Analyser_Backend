"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

const baseURL = "http://localhost:5000/api/v1";
const SOCKET_URL = "http://localhost:5000";

interface AnalysisProgress {
  status: "processing" | "done" | "failed";
  progress: number;
  message: string;
  step: string;
  data?: any;
  error?: string;
}

interface Analysis {
  _id: string;
  overallScore: number;
  skillsDetected: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  analyzedAt: string;
}
interface Props {
  onClose: () => void;
}

export default function CVAnalysis({ onClose }: Props) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    status: "processing",
    progress: 0,
    message: "Waiting to start...",
    step: "init",
  });
  const [completedAnalysis, setCompletedAnalysis] = useState<Analysis | null>(
    null
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAccessToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
  };

  // Initialize Socket.IO
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    console.log("🔌 Connecting to Socket.IO...");
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Listen for analysis progress
//   useEffect(() => {
//     if (!socket || !analysisId) return;

//     const room = `analysis-${analysisId}`;
//     console.log(`📡 Joining room: ${room}`);

//     socket.emit("join", room);

//     socket.on("analysis-progress", (data: AnalysisProgress) => {
//       console.log("📊 Progress update:", data);
//       setProgress(data);

//       if (data.status === "done" && data.data) {
//         setCompletedAnalysis(data.data);
//         setAnalyzing(false);
//         toast.success("✅ Analysis completed!");

//         // Play success sound
//         playSuccessSound();
//       }

//       if (data.status === "failed") {
//         setAnalyzing(false);
//         toast.error(`❌ Analysis failed: ${data.error || "Unknown error"}`);
//       }
//     });

//     return () => {
//       socket.off("analysis-progress");
//       socket.emit("leave", room);
//     };
//   }, [socket, analysisId]);


// Simple polling (no socket)
useEffect(() => {
  if (!analysisId || !analyzing) return;

  const interval = setInterval(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/cv/analyses/${analysisId}`);

      if (data.status === "done") {
        setCompletedAnalysis(data);
        setAnalyzing(false);
        clearInterval(interval);
        onClose();
        playSuccessSound();
        
      }

      if (data.status === "pending") {
        setProgress(prev => ({
          ...prev,
          progress: Math.min(95, prev.progress + 10),
          message: "Analysis pending! Please wait...", 
          step: "ai-analysis", 
        }));
      }

      if (data.status === "failed") {
        setAnalyzing(false);
        clearInterval(interval);
        toast.error("❌ Analysis failed");
      }

    } catch (err) {
      console.log("Polling error");
    }
  }, 2000);

  return () => clearInterval(interval);
}, [analysisId, analyzing]);


  const playSuccessSound = () => {
    // Optional: Play a success sound
    const audio = new Audio("/success.mp3");
    audio.play().catch((e) => console.log("Sound not available"));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setCompletedAnalysis(null);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select a CV file");
      return;
    }

    try {
      setUploading(true);
      setAnalyzing(true);
      setProgress({
        status: "processing",
        progress: 5,
        message: "Uploading your CV...",
        step: "upload",
      });

      const token = getAccessToken();
      const formData = new FormData();
      formData.append("cv", selectedFile);

      console.log("📤 Uploading CV...");

      const { data } = await axios.post(`${baseURL}/cv/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload response:", data);

      setAnalysisId(data.analysisId);
      setUploading(false);

      setProgress({
        status: "processing",
        progress: 10,
        message: "CV uploaded! Starting analysis...",
        step: "queued",
      });

      toast.success("CV uploaded! Analysis started...");
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      setUploading(false);
      setAnalyzing(false);
      toast.error(error.response?.data?.error || "Failed to upload CV");
    }
  };

//   const getProgressColor = () => {
//     if (progress.progress < 30) return "bg-blue-500";
//     if (progress.progress < 60) return "bg-yellow-500";
//     if (progress.progress < 90) return "bg-orange-500";
//     return "bg-green-500";
//   };

  const getStepIcon = () => {
    switch (progress.step) {
      case "upload":
        return "📤";
      case "download":
        return "☁️";
      case "extract":
        return "📄";
      case "ai-analysis":
        return "🤖";
      case "save":
        return "💾";
      case "update-profile":
        return "👤";
      case "job-matching":
        return "🎯";
      case "complete":
        return "🎉";
      case "error":
        return "❌";
      default:
        return "⏳";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}

      {/* Upload Section */}
      {!analyzing && !completedAnalysis && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold mb-6">Upload Your CV</h2>

          <div className="mb-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="mb-4">
                <span className="text-6xl">{selectedFile ? "✅" : "📄"}</span>
              </div>

              <p className="text-lg font-medium mb-2">
                {selectedFile ? selectedFile.name : "Click to upload your CV"}
              </p>
              <p className="text-sm text-gray-500">PDF format, max 10MB</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleUploadAndAnalyze}
              disabled={!selectedFile || uploading}
              className="flex-1 bg-blue-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Start Analysis
                </>
              )}
            </button>

            {selectedFile && (
              <button
                onClick={() => setSelectedFile(null)}
                className="px-6 py-4 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-bold text-blue-900 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span>1️⃣</span>
                <span>AI analyzes your CV (30-60 seconds)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>2️⃣</span>
                <span>Get ATS score, strengths, and recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span>3️⃣</span>
                <span>Receive personalized job recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span>4️⃣</span>
                <span>View detailed analysis report</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Real-Time Progress */}
      {analyzing && !completedAnalysis && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-500 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">{getStepIcon()}</div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Your CV</h2>
            <p className="text-gray-600">{progress.message}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm font-bold text-blue-600">
                {progress.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>

          {/* Steps Progress */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: "upload", label: "Upload", icon: "📤" },
              { step: "extract", label: "Extract Text", icon: "📄" },
              { step: "ai-analysis", label: "AI Analysis", icon: "🤖" },
              { step: "job-matching", label: "Job Match", icon: "🎯" },
            ].map((item) => (
              <div
                key={item.step}
                className={`text-center p-4 rounded-xl transition-all ${
                  progress.step === item.step
                    ? "bg-blue-100 border-2 border-blue-500"
                    : progress.progress > 25 && item.step === "upload"
                    ? "bg-green-50 border border-green-300"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800 text-center">
              ⏱️ This usually takes 30-60 seconds. Please don't close this page.
            </p>
          </div>
        </div>
      )}

      {/* Completed Analysis */}
      {completedAnalysis && (
        <div className="space-y-6">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-6">
              <div className="text-7xl">🎉</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">Analysis Complete!</h2>
                <p className="text-white/90 text-lg">
                  Your CV has been analyzed. Check out your results below.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-1">
                  {completedAnalysis.overallScore}
                </div>
                <p className="text-sm text-white/80">ATS Score</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <p className="text-gray-600 text-sm">Skills Detected</p>
                  <p className="text-3xl font-bold">
                    {completedAnalysis.skillsDetected.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💪</div>
                <div>
                  <p className="text-gray-600 text-sm">Strengths</p>
                  <p className="text-3xl font-bold">
                    {completedAnalysis.strengths.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💡</div>
                <div>
                  <p className="text-gray-600 text-sm">Recommendations</p>
                  <p className="text-3xl font-bold">
                    {completedAnalysis.recommendations.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/user/job-matches")}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-colors flex items-center justify-center gap-3"
              >
                <span>🎯</span>
                View Job Recommendations
              </button>

              <button
                onClick={() => router.push("/user/my-analyses")}
                className="bg-blue-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
              >
                <span>📊</span>
                View Full Report
              </button>
            </div>
          </div>

          {/* Quick Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Skills Detected</h3>
            <div className="flex flex-wrap gap-2">
              {completedAnalysis.skillsDetected
                .slice(0, 15)
                .map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              {completedAnalysis.skillsDetected.length > 15 && (
                <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  +{completedAnalysis.skillsDetected.length - 15} more
                </span>
              )}
            </div>
          </div>

          {/* Start New Analysis */}
          <button
            onClick={() => {
              setCompletedAnalysis(null);
              setAnalysisId(null);
              setSelectedFile(null);
              setProgress({
                status: "processing",
                progress: 0,
                message: "Waiting to start...",
                step: "init",
              });
            }}
            className="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Analyze Another CV
          </button>
        </div>
      )}
    </div>
  );
}
