"use client";
import React from "react";
import "@/globals/styles/style.color.css";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { RiPhoneLine } from "react-icons/ri";
import { GrLocation } from "react-icons/gr";


const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Jobs", href: "/jobs" },
    { name: "Services", href: "/services" },
    { name: "Contact Us", href: "/contact-us" },

    { name: "Analyse-Cv", href: "/analyse-cv" },
  ];

  const resources = [
    { name: "Careers Guide", href: "/careers-guide" },
    { name: "Interview Tips", href: "/interview-tips" },
    { name: "Terms And Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Blog", href: "/blog" },
    { name: "Help Center", href: "/help-center" },
  ];
  return (
    <div>
      <div className=" grid grid-cols-2 md:grid-cols-4 items-start justify-evenly footer_bg w-full px-10 pt-10">
        <div>
          <div className="flex flex-col items-start    col-span-2">
            <h1 className="text-white text-xl mb-1 font-semibold">Career Sync</h1>
            <p className="text-xs text-white w-[55%]">
              Transform your resume with AI-powered analysis and land our dream
              job faster.
            </p>
            <p className="text-xs font-semibold text-white">Follow us</p>
            <div>
              <div className="flex gap-x-3 mt-2">
                <a
                  href="https://www.facebook.com/"
                  className="p-2 bg-white rounded-full"
                >
                  <FaFacebook size={20} className="text-black cursor-pointer" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  className="p-2 bg-white rounded-full"
                >
                  <FaInstagram
                    size={20}
                    className="text-black cursor-pointer"
                  />
                </a>
                <a href="https://x.com/" className="p-2 bg-white rounded-full">
                  <FaXTwitter size={20} className="text-black cursor-pointer" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div>
            <p className="text-white text-lg mb-1 font-normal">Quick Links</p>
          </div>
          <div>
            {quickLinks.map((link) => (
              <div key={link.name} className="mb-2">
                <a
                  href={link.href}
                  className="text-white text-sm hover:underline"
                >
                  {link.name}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div>
            <p className="text-white text-lg mb-1 font-normal">Resources</p>
          </div>
          <div>
            {resources.map((resource) => (
              <div key={resource.name} className="mb-2">
                <a
                  href={resource.href}
                  className="text-white text-sm hover:underline"
                >
                  {resource.name}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div>
            <p className="text-white text-lg mb-1 font-normal">Contact</p>
          </div>
          <div>
            <div className="flex gap-2 items-center mb-2">
              <div>
                <CiMail size={20} className="text-white" />
              </div>
              <p className="text-white text-sm">Email:</p>
            </div>
            <div className="flex gap-2 items-center mb-2">
              <div>
                <RiPhoneLine size={20} className="text-white" />
              </div>
              <p className="text-white text-sm">phone </p>
            </div>
            <div className="flex gap-2 items-center mb-2" >
              <div>
                    <GrLocation size={20} className="text-white" />
              </div>
              <p className="text-white text-sm">Old Baneshwor, Kathmandu, Nepal</p>
            </div>
            <div>
              <iframe
              className="w-[180px] md:w-[300px] h-[100px]"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7065.149420288041!2d85.33723278713099!3d27.699536554070825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199b0bc829b7%3A0x265edcae115c10c!2sGlobal%20College%20of%20Management!5e0!3m2!1sen!2snp!4v1763912301481!5m2!1sen!2snp"
             
                height="100"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <hr className="text-white" />
        <h1 className="text-white text-xs  p-5 footer_bg">
          © 2025 Career Sync Pvt Ltd. All Rights Reserved.
        </h1>
        <hr className="text-white" />
        <div className="footer_bg h-10">

        </div>
      </div>
    </div>
  );
};
export default Footer;
