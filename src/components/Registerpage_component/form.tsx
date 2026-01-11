
// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
// import { toast } from "sonner";
// import Link from "next/link";

// const BASE_URL = "https://cv-analyser-backend.onrender.com/api/v1";

// type FormData = {
//   firstName?: string;
//   lastName?: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   fullName: string;
//   phoneNumber: string;
//   agreed: boolean;
// };

// const RegistrationForm = () => {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setError,
//   } = useForm<FormData>();

//   const password = watch("password");

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true);

//     try {
//       // Split full name into first and last name
//       const nameParts = data.fullName.trim().split(" ");
//       const firstName = nameParts[0];
//       const lastName = nameParts.slice(1).join(" ") || "";

//       const response = await fetch(`${BASE_URL}/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: data.email.toLowerCase().trim(),
//           password: data.password,
//           firstName,
//           lastName,
//           phoneNumber: data.phoneNumber,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         toast.success("Registration successful! Please verify your email.");
        
//         // Redirect to OTP verification page with user info
//         const params = new URLSearchParams({
//           userId: result.user._id,
//           email: result.user.email,
//         });
        
//         router.push(`/verify-otp?${params.toString()}`);
//       } else {
//         // Handle validation errors
//         if (result.errors && Array.isArray(result.errors)) {
//           result.errors.forEach((err: string) => {
//             toast.error(err);
//           });
//         } else {
//           toast.error(result.error || "Registration failed. Please try again.");
//         }

//         // Set specific field errors if applicable
//         if (result.error?.toLowerCase().includes("email")) {
//           setError("email", { message: result.error });
//         }
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error("Network error. Please check your connection.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-lg">
//         {/* Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <svg
//                 className="w-8 h-8 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
//                 />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">
//               Create Account
//             </h1>
//             <p className="text-gray-500 text-sm">
//               Join CV Saathi and land your dream job
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* Full Name & Phone */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("fullName", {
//                     required: "Full name is required",
//                     minLength: { value: 2, message: "Name too short" },
//                   })}
//                   type="text"
//                   placeholder="John Doe"
//                   className={`w-full px-4 py-3 rounded-xl border ${
//                     errors.fullName ? "border-red-300" : "border-gray-200"
//                   } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white`}
//                 />
//                 {errors.fullName && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.fullName.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("phoneNumber", {
//                     required: "Phone number is required",
//                     minLength: { value: 10, message: "At least 10 digits" },
//                     pattern: {
//                       value: /^[\d\s\-+()]+$/,
//                       message: "Invalid phone number",
//                     },
//                   })}
//                   type="tel"
//                   placeholder="+977 9800000000"
//                   className={`w-full px-4 py-3 rounded-xl border ${
//                     errors.phoneNumber ? "border-red-300" : "border-gray-200"
//                   } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white`}
//                 />
//                 {errors.phoneNumber && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.phoneNumber.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 type="email"
//                 placeholder="john@example.com"
//                 className={`w-full px-4 py-3 rounded-xl border ${
//                   errors.email ? "border-red-300" : "border-gray-200"
//                 } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white`}
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 8,
//                       message: "Password must be at least 8 characters",
//                     },
//                   })}
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   className={`w-full px-4 py-3 pr-12 rounded-xl border ${
//                     errors.password ? "border-red-300" : "border-gray-200"
//                   } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <FaRegEye size={18} />
//                   ) : (
//                     <FaRegEyeSlash size={18} />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirm Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   {...register("confirmPassword", {
//                     required: "Please confirm your password",
//                     validate: (value) =>
//                       value === password || "Passwords do not match",
//                   })}
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   className={`w-full px-4 py-3 pr-12 rounded-xl border ${
//                     errors.confirmPassword ? "border-red-300" : "border-gray-200"
//                   } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showConfirmPassword ? (
//                     <FaRegEye size={18} />
//                   ) : (
//                     <FaRegEyeSlash size={18} />
//                   )}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.confirmPassword.message}
//                 </p>
//               )}
//             </div>

//             {/* Agreement */}
//             <div className="flex items-start gap-3">
//               <input
//                 {...register("agreed", {
//                   required: "You must agree to continue",
//                 })}
//                 type="checkbox"
//                 id="agreement"
//                 className="mt-1 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
//               />
//               <label htmlFor="agreement" className="text-sm text-gray-600">
//                 I agree to the{" "}
//                 <Link
//                   href="/terms"
//                   className="text-cyan-600 hover:underline"
//                   target="_blank"
//                 >
//                   Terms & Conditions
//                 </Link>{" "}
//                 and{" "}
//                 <Link
//                   href="/privacy"
//                   className="text-cyan-600 hover:underline"
//                   target="_blank"
//                 >
//                   Privacy Policy
//                 </Link>
//               </label>
//             </div>
//             {errors.agreed && (
//               <p className="text-sm text-red-500">{errors.agreed.message}</p>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
//                 isLoading
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 shadow-lg hover:shadow-xl"
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin w-5 h-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Creating Account...
//                 </>
//               ) : (
//                 "Register Now"
//               )}
//             </button>
//           </form>

//           {/* Login Link */}
//           <p className="mt-6 text-center text-gray-500 text-sm">
//             Already have an account?{" "}
//             <Link
//               href="/login"
//               className="text-cyan-600 font-medium hover:underline"
//             >
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { toast } from "sonner";

const BASE_URL = "https://cv-analyser-backend.onrender.com/api/v1";

type FormData = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  agreed: boolean;
};

const RegistrationForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const nameParts = data.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
          password: data.password,
          firstName,
          lastName,
          phoneNumber: data.phoneNumber,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Registration successful! Please verify your email.");
        const params = new URLSearchParams({
          userId: result.user._id,
          email: result.user.email,
        });
        router.push(`/verify-otp?${params.toString()}`);
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err: string) => {
            toast.error(err);
          });
        } else {
          toast.error(result.error || "Registration failed. Please try again.");
        }
        if (result.error?.toLowerCase().includes("email")) {
          setError("email", { message: result.error });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name
        </label>
        <input
          {...register("fullName", {
            required: "Full name is required",
            minLength: { value: 2, message: "Name too short" },
          })}
          type="text"
          className={`w-full px-4 py-2.5 rounded-lg border-2 ${
            errors.fullName
              ? "border-red-300 focus:border-red-400"
              : "border-gray-200 focus:border-blue-400"
          } focus:outline-none transition-colors bg-white`}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone Number
        </label>
        <input
          {...register("phoneNumber", {
            required: "Phone number is required",
            minLength: { value: 10, message: "At least 10 digits" },
            pattern: {
              value: /^[\d\s\-+()]+$/,
              message: "Invalid phone number",
            },
          })}
          type="tel"
          className={`w-full px-4 py-2.5 rounded-lg border-2 ${
            errors.phoneNumber
              ? "border-red-300 focus:border-red-400"
              : "border-gray-200 focus:border-blue-400"
          } focus:outline-none transition-colors bg-white`}
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-xs text-red-500">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          type="email"
          className={`w-full px-4 py-2.5 rounded-lg border-2 ${
            errors.email
              ? "border-red-300 focus:border-red-400"
              : "border-gray-200 focus:border-blue-400"
          } focus:outline-none transition-colors bg-white`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            className={`w-full px-4 py-2.5 pr-10 rounded-lg border-2 ${
              errors.password
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-blue-400"
            } focus:outline-none transition-colors bg-white`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <FaRegEye size={18} />
            ) : (
              <FaRegEyeSlash size={18} />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Agreement Checkbox */}
      <div className="flex items-start gap-2 pt-1">
        <input
          {...register("agreed", {
            required: "You must agree to continue",
          })}
          type="checkbox"
          id="agreement"
          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor="agreement"
          className="text-sm text-gray-600 leading-tight cursor-pointer"
        >
          By signing up, I agree to our{" "}
          <a
            href="/terms"
            className="text-blue-600 hover:underline font-medium"
            target="_blank"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-blue-600 hover:underline font-medium"
            target="_blank"
          >
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.agreed && (
        <p className="text-xs text-red-500 -mt-2">{errors.agreed.message}</p>
      )}

      {/* Register Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 mt-2 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 ${
          isLoading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 shadow-lg hover:shadow-xl active:scale-[0.98]"
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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
            Creating Account...
          </>
        ) : (
          "Register Now"
        )}
      </button>
    </form>
  );
};

export default RegistrationForm;