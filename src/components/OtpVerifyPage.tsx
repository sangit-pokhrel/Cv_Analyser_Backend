"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const BASE_URL = "https://cv-analyser-backend.onrender.com/api/v1";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get userId and email from URL params (set during registration)
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  
  // Timer states
  const [expiryTime, setExpiryTime] = useState(600); // 10 minutes in seconds
  const [cooldownTime, setCooldownTime] = useState(0);
  
  // Refs for OTP inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Expiry timer
  useEffect(() => {
    if (expiryTime > 0) {
      const timer = setInterval(() => {
        setExpiryTime((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [expiryTime]);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    
    // Handle paste of full OTP
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when typing
    if (error) setError("");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split("").forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (expiryTime === 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          email,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Email verified successfully!");
        
        // Store token if returned
        if (data.accessToken) {
          document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900`; // 15 min
        }
        
        // Redirect to dashboard or home
        router.push("/");
      } else {
        setError(data.error || "Verification failed");
        
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        
        if (data.reason === "no_otp_found" || data.reason === "expired") {
          setExpiryTime(0);
        }
        
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldownTime > 0) return;

    setIsResending(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("New OTP sent to your email!");
        setExpiryTime(data.otpExpiresIn || 600);
        setCooldownTime(60); // 60 second cooldown
        setOtp(["", "", "", "", "", ""]);
        setAttemptsLeft(null);
        inputRefs.current[0]?.focus();
      } else {
        if (data.waitTime) {
          setCooldownTime(data.waitTime);
        }
        setError(data.error || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when all digits entered
  useEffect(() => {
    if (otp.every((digit) => digit !== "") && !isLoading) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-500 text-sm">
              We&apos;ve sent a 6-digit code to
            </p>
            <p className="text-cyan-600 font-medium">
              {email || "your email"}
            </p>
          </div>

          {/* Timer */}
          <div className="flex justify-center mb-6">
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                expiryTime > 60
                  ? "bg-cyan-50 text-cyan-700"
                  : expiryTime > 0
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
              }`}
            >
              {expiryTime > 0 ? (
                <>
                  <span className="mr-1">⏱</span>
                  Code expires in {formatTime(expiryTime)}
                </>
              ) : (
                <>
                  <span className="mr-1">⚠️</span>
                  Code expired
                </>
              )}
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading || expiryTime === 0}
                className={`
                  w-12 h-14 sm:w-14 sm:h-16
                  text-center text-2xl font-bold
                  border-2 rounded-xl
                  transition-all duration-200
                  focus:outline-none focus:ring-4
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : digit
                        ? "border-cyan-400 bg-cyan-50 focus:border-cyan-500 focus:ring-cyan-100"
                        : "border-gray-200 focus:border-cyan-500 focus:ring-cyan-100"
                  }
                `}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600 text-sm">{error}</p>
              {attemptsLeft !== null && attemptsLeft > 0 && (
                <p className="text-red-500 text-xs mt-1">
                  {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining
                </p>
              )}
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading || otp.some((d) => !d) || expiryTime === 0}
            className={`
              w-full py-3 rounded-xl font-semibold text-white
              transition-all duration-200
              flex items-center justify-center gap-2
              ${
                isLoading || otp.some((d) => !d) || expiryTime === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 shadow-lg hover:shadow-xl"
              }
            `}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={isResending || cooldownTime > 0}
              className={`
                text-sm font-medium transition-colors
                ${
                  isResending || cooldownTime > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-cyan-600 hover:text-cyan-700"
                }
              `}
            >
              {isResending ? (
                "Sending..."
              ) : cooldownTime > 0 ? (
                `Resend in ${cooldownTime}s`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Check your spam folder if you don&apos;t see the email.
          <br />
          Still having trouble?{" "}
          <Link href="/contact" className="text-cyan-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}