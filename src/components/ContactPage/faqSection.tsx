"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { CiCircleQuestion } from "react-icons/ci";
import Section from "@/globals/section";
import "@/globals/styles/style.color.css"
type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "How accurate is the CV analysis?",
    answer:
      "Our AI-powered analysis is trained on thousands of successful resumes and uses industry-standard criteria. It provides 95%+ accuracy in identifying areas for improvement.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use bank-level encryption and never share your personal information. Your CV is automatically deleted after analysis unless you choose to save it.",
  },
  {
    question: "How long does the analysis take?",
    answer:
      "Absolutely. We use bank-level encryption and never share your personal information. Your CV is automatically deleted after analysis unless you choose to save it",
  },
  {
    question: "Can I analyze multiple CVs?",
    answer:
      "Yes! You can analyze as many CVs as you need. We recommend analyzing different versions to see which performs best.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Section>
      <div className="flex flex-col gap-y-8 ">
        <div className=" flex flex-col gap-y-2">
        <h1 className="text-center text-4xl font-bold secondary">Frequently Asked Question</h1>
            <p className="text-center text-sm font-extralight ">
        Find quick answers to common questions
      </p>
      </div>
            

      <div className="space-y-4 ">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-300 rounded-xl bg-white "
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex gap-x-4">
                  <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="cta_button rounded px-3 py-2 " >
                  <CiCircleQuestion size={30} color="white"/>
                  </div>

                 
                </div>
                <div className="flex flex-col justify-start items-start">
                  {/* Question */}
                  <h3 className="text-md font-semibold">
                    {faq.question}
                  </h3>
                {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-40 opacity-100 w-full" : "max-h-0 opacity-0"
                }`}
              >
                <p className=" text-sm text-gray-600 ">
                  {faq.answer}
                </p>
              </div>
                </div>
                </div>

                {/* Arrow */}
                <FiChevronDown size={30}
                  className={`text-xl text-gray-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  
                />
                 
              </button>

              
            </div>
          );
        })}
      </div>
      </div>
    </Section>
  );
};

export default FAQSection;
