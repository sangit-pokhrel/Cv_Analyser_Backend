'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';

interface AnalysisProgress {
  status: 'processing' | 'done' | 'failed';
  progress: number;
  message: string;
  step: string;
  error?: string;
}

export default function CVAnalysisPage() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [token, setToken] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // Save token to localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) setToken(savedToken);
  }, []);

  const saveToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('jwt_token', newToken);
  };

  // Listen for WebSocket events
  useEffect(() => {
    if (!socket || !analysisId) return;

    socket.on('subscribed', (data) => {
      addLog(`📡 Subscribed to analysis: ${data.analysisId}`);
    });

    socket.on('analysis-progress', (data: AnalysisProgress) => {
      addLog(`📊 ${data.progress}% - ${data.message}`);
      setProgress(data);

      // Redirect to results page when complete
      if (data.status === 'done') {
        addLog('✅ Analysis COMPLETE! Redirecting to results...');
        setTimeout(() => {
          router.push(`/cv-analysis/${analysisId}`);
        }, 2000);
      } else if (data.status === 'failed') {
        addLog(`❌ Analysis FAILED: ${data.error}`);
      }
    });

    return () => {
      socket.off('subscribed');
      socket.off('analysis-progress');
    };
  }, [socket, analysisId, router]);

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
      addLog(`📄 Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
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
    setAnalysisId(null);
    addLog('⏳ Uploading CV to server...');

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
        addLog(`✅ Upload successful!`);
        addLog(`📋 Analysis ID: ${data.analysisId}`);
        setAnalysisId(data.analysisId);

        // Subscribe to real-time updates
        if (socket) {
          socket.emit('subscribe-analysis', data.analysisId);
          addLog(`📡 Subscribed to real-time updates`);
        }
      } else {
        addLog(`❌ Upload failed: ${data.error || data.message}`);
        alert(`Upload failed: ${data.error || data.message}`);
        setIsUploading(false);
      }
    } catch (error: any) {
      addLog(`❌ Network error: ${error.message}`);
      alert(`Error: ${error.message}`);
      setIsUploading(false);
    }
  };

  // Reset form
  const reset = () => {
    setSelectedFile(null);
    setAnalysisId(null);
    setProgress(null);
    setLogs([]);
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                AI CV Analyzer
              </h1>
              <p className="text-gray-600">
                Upload your CV and get instant AI-powered insights
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm font-medium hidden md:inline">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Token Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            JWT Authentication Token
          </label>
          <input
            type="password"
            placeholder="Paste your JWT token here..."
            value={token}
            onChange={(e) => saveToken(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Get this from your login response. It will be saved in your browser.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your CV</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
            <input
              type="file"
              id="cvFile"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <label htmlFor="cvFile" className="cursor-pointer flex flex-col items-center">
              <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {selectedFile ? (
                <>
                  <span className="text-lg font-medium text-gray-800 mb-1">
                    {selectedFile.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB • Click to change
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg font-medium text-gray-700 mb-1">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-sm text-gray-500">
                    PDF only, max 5MB
                  </span>
                </>
              )}
            </label>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={uploadCV}
              disabled={!selectedFile || !token || isUploading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                '🚀 Analyze CV'
              )}
            </button>
            <button
              onClick={reset}
              disabled={isUploading}
              className="px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress Section */}
        {progress && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Analysis Progress</h2>
              <span className="text-2xl font-bold text-blue-600">
                {progress.progress}%
              </span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-3 mb-4 flex rounded-full bg-gradient-to-r from-blue-200 to-purple-200">
                <div
                  style={{ width: `${progress.progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {progress.status === 'done' ? '✅' : progress.status === 'failed' ? '❌' : '⏳'}
              </div>
              <div>
                <p className="font-medium text-gray-800">{progress.message}</p>
                <p className="text-sm text-gray-600 mt-1">Step: {progress.step}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logs Section */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Live Activity Log</h2>
          <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">Waiting for activity...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-green-400 mb-1 hover:bg-gray-800 px-2 py-1 rounded">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}