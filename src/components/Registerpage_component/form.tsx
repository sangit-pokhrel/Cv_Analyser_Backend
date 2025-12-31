"use client";
import React from "react";
import { useState, useRef } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import "@/globals/styles/style.color.css";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { useRegisterMutation } from "./api/registerApi";
const RegistrationForm = () => {
    const registerMutation = useRegisterMutation();
  type formdata = {
    firstName?:string,
    lastName?:string,
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phoneNumber: Number;
    agreed: boolean;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<formdata>();
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };
  const password = watch("password");

  const onSubmit = (data: formdata) => {
    const [firstName,...rest]  = data.fullName.split(" ");
    const lastName = rest.join(" ");
    data.firstName = firstName;
    data.lastName = lastName;
    registerMutation.mutate(data)
   
  }

  return (
    <div>
      <form className=" flex flex-col  mt-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-1">
          {/* Full name and Phone number */}

          <div className="grid md:grid-cols-2 grid-cols-1 gap-x-5">
            <div>
              <label htmlFor="Full Name" className="ml-1 ">
                Full Name
              </label>
              <input
                {...register("fullName", { required: true })}
                id="Full Name"
                className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none bg-white focus:ring-2 focus:ring-blue-200 "
                type="text"
              />
              {errors.fullName && (
                <span className=" text-red-500">This field is required</span>
              )}
            </div>
            <div>
              <label htmlFor="Phone Number" className="ml-1">
                Phone Number
              </label>
              <input
                {...register("phoneNumber", { required: true, minLength: 10 })}
                id="Phone Number"
                className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200"
                type="text"
              />
              {errors.phoneNumber && (
                <span className=" text-red-500">
                  This field is required and should be at least 10 digits
                </span>
              )}
            </div>
          </div>

          {/* Email */}

          <div>
            <label htmlFor="Email" className="ml-1">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              id="Email"
              className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200"
              type="email"
            />
            {errors.email && (
              <span className=" text-red-500">This field is required</span>
            )}
          </div>

          {/* Password and Confirm Password */}

          <div>
            <div className="relative">
              <label htmlFor="Password" className="ml-1">
                Password
              </label>
              <input
                {...register("password", { required: true, minLength: 8 })}
                id="Password"
                className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200"
                type={show ? "text" : "password"}
              />
              {errors.password && (
                <span className=" text-red-500">
                  This field is required and should be at least 8 characters
                </span>
              )}
              <div onClick={handleClick}>
                {!show ? (
                  <FaRegEyeSlash className=" absolute top-10 right-1   cursor-pointer" />
                ) : (
                  <FaRegEye className=" absolute top-10 right-1  cursor-pointer" />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="relative">
              <label htmlFor=" Confirm Password" className="ml-1">
                {" "}
                Confirm Password
              </label>
              <input
                {...register("confirmPassword", {
                  required: true,
                  minLength: 8,
                  validate: (value) =>
                    value == password || "The passwords do not match",
                })}
                id=" Confirm Password"
                className=" mt-1 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white focus:ring-blue-200"
                type={show ? "text" : "password"}
              />
              {errors.confirmPassword && (
                <span className=" text-red-500">
                  {errors.confirmPassword.message as string}
                </span>
              )}
              <div onClick={handleClick}>
                {!show ? (
                  <FaRegEyeSlash className=" absolute top-10 right-1     cursor-pointer" />
                ) : (
                  <FaRegEye className="absolute right-1 top-10  cursor-pointer" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Aggrement checkbox */}

        <p className="text-sm text-light ml-1">
          <input
            {...register("agreed", { required: true })}
            type="checkbox"
            className="mr-1"
          />
          By signing up, I agree to our{" "}
          <a
            href="youtube.com"
            className="text-blue-500 underline px-1"
            target="_blank "
          >
            Terms & Conditions{" "}
          </a>{" "}
          and{" "}
          <a href="" className="text-blue-500 underline px-1" target="_blank">
            Priacy Policy
          </a>
        </p>
        {errors.agreed && (
          <span className=" text-red-500">
            You must agree before submitting.
          </span>
        )}

        {/* submit button */}
        <div className="flex justify-center items-center pt-3">
          <button
            type="submit"
            className="cta_button px-14 py-3 rounded-md cursor-pointer "
          >
            Register Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
