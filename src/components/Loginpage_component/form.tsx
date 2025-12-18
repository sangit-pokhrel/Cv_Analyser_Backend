"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className="space-y-4">
      {/* Email Field */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <Input id="email" type="email" className="w-full focus:ring-2 focus:ring-blue-200" placeholder=""  />
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Input id="password" type={showPassword ? "text" : "password"} className="w-full pr-10 focus:ring-2 focus:ring-blue-200" placeholder="" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-xs text-blue-500 hover:underline">
          Forgot Password?
        </Link>
      </div>

      {/* Sign In Button */}
      <Button type="submit" className="w-full bg-[#FFB347] hover:bg-[#ffa52e] text-black font-medium">
        Sign In
      </Button>
    </form>
  )
}
