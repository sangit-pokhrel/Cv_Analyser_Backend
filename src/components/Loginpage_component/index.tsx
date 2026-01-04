

import { LoginForm } from "./form"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import Link from "next/link"
import Container from "@/globals/container"
export default function LoginPage() {
  return (
    <Container>
      // FULL VIEWPORT, TRUE CENTER
    <div className="min-h-screen bg-[#F8FCFF] flex items-center justify-center m-auto ">
      
      {/* VISUAL BLOCK */}
      <div className="w-full max-w-6xl">

        {/* MAIN ROW */}
        <div className="flex flex-col lg:flex-row items-center gap-12 align-middle m-auto justify-center ">

          {/* LEFT – FORM */}
          <div className="w-full max-w-md flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Sign In
              </h1>
              <p className="text-sm text-gray-500">
                Seems like you have already an account. Let&apos;s make the Cv Better !!!
              </p>
            </div>

            <LoginForm />

            <p className="text-center text-sm text-gray-600 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-500 font-medium hover:underline">
                Register Here
              </Link>
            </p>

            <div className="my-6 border-t border-gray-300" />

            <div className="flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-full bg-white hover:bg-gray-50 text-sm font-medium text-gray-600 whitespace-nowrap">
                <FcGoogle className="w-5 h-5" />
                Continue With Google
              </button>

              <span className="text-sm text-gray-400 font-medium">OR</span>

              <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-full bg-white hover:bg-gray-50 text-sm font-medium text-gray-600 whitespace-nowrap">
                <FaFacebook className="w-4 h-4 text-blue-600" />
                Continue With Facebook
              </button>
            </div>
          </div>

          {/* RIGHT – IMAGE */}
          <div className="hidden lg:block">
            <div className="w-[420px] h-[560px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://plus.unsplash.com/premium_photo-1720192861639-1524439fc166?q=80&w=1170&auto=format&fit=crop"
                alt="Login visual"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
    </Container>
  )
}


