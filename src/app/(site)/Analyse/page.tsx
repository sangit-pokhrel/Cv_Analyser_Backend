'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface AnalysisProgress {
  status: 'processing' | 'done' | 'failed';
  progress: number;
  message: string;
  step: string;
  error?: string;
  data?: any;
}

interface AnalysisResult {
  analysisId: string;
  overallScore: number;
  skillsDetected: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  extractedData: {
    experience: string;
    education: string[];
    certifications: string[];
    languages: string[];
    totalYearsExperience: number;
  };
  analyzedAt: string;
}

export default function CVAnalysisPage() {
  const { socket, isConnected } = useSocket();
  const [token, setToken] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // Listen for WebSocket events
  useEffect(() => {
    if (!socket) return;

    socket.on('subscribed', (data) => {
      addLog(`📡 Subscribed to analysis: ${data.analysisId}`);
    });

    socket.on('analysis-progress', (data: AnalysisProgress) => {
      addLog(`📊 Progress: ${data.progress}% - ${data.message}`);
      setProgress(data);

      if (data.status === 'done' && data.data) {
        addLog('✅ Analysis COMPLETE!');
        setResult(data.data);
      } else if (data.status === 'failed') {
        addLog(`❌ Analysis FAILED: ${data.error}`);
      }
    });

    return () => {
      socket.off('subscribed');
      socket.off('analysis-progress');
    };
  }, [socket]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      addLog(`📄 Selected file: ${file.name}`);
    }
  };

  // Upload and analyze CV
  const uploadCV = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file');
      return;
    }

    if (!token) {
      alert('Please enter your JWT token');
      return;
    }

    setIsUploading(true);
    setProgress(null);
    setResult(null);
    addLog('⏳ Uploading CV...');

    const formData = new FormData();
    formData.append('cv', selectedFile);

    try {
      const res = await fetch(`${API_URL}/api/v1/cv/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        addLog(`✅ Upload successful! Analysis ID: ${data.analysisId}`);
        setAnalysisId(data.analysisId);

        // Subscribe to real-time updates
        if (socket) {
          socket.emit('subscribe-analysis', data.analysisId);
        }
      } else {
        addLog(`❌ Upload failed: ${data.error || data.message}`);
        alert(`Upload failed: ${data.error || data.message}`);
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form
  const reset = () => {
    setSelectedFile(null);
    setAnalysisId(null);
    setProgress(null);
    setResult(null);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            CV Analysis - Real-time WebSocket
          </h1>
          <p className="text-gray-600">
            Upload your CV and watch the AI analyze it in real-time
          </p>
          
          {/* Connection Status */}
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected to WebSocket' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-6">
            {/* Token Input */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Authentication</h2>
              <input
                type="text"
                placeholder="Enter JWT Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Get your token from the login API response
              </p>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload CV</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="cvFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="cvFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedFile ? selectedFile.name : 'Click to upload PDF'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Max 5MB
                  </span>
                </label>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={uploadCV}
                  disabled={!selectedFile || !token || isUploading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Analyze'}
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {progress && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Progress</h2>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {progress.step}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {progress.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-blue-200">
                    <div
                      style={{ width: `${progress.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{progress.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results & Logs */}
          <div className="space-y-6">
            {/* Results */}
            {result && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
                
                {/* Overall Score */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                  <p className="text-sm font-medium mb-1">Overall Score</p>
                  <p className="text-4xl font-bold">{result.overallScore}/100</p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Skills Detected ({result.skillsDetected.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.skillsDetected.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-green-700">✅ Strengths</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {result.strengths.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-orange-700">⚠️ Areas for Improvement</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {result.weaknesses.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold mb-2 text-blue-700">💡 Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {result.recommendations.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Logs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Real-time Logs</h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <p className="text-gray-500">Waiting for activity...</p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}