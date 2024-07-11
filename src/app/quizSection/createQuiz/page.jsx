"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "../../../helpers/axiosInstance";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CreateQuiz = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [quizTitle, setQuizTitle] = useState("");
  const [checkingType, setCheckingType] = useState("");
  const [gradingEnabled, setGradingEnabled] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questionCreationMethod, setQuestionCreationMethod] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("/api/quiz/createquiz", {
        title: quizTitle,
        checkingType,
        gradingEnabled,
        isTimed,
        startTime: isTimed ? startTime : null,
        endTime: isTimed ? endTime : null,
      });
      const { quizId } = response.data;
    
      questionCreationMethod==="ai"? router.push(`/quizSection/Ai/${quizId}`):router.push(`/quizSection/createquestion?quizId=${quizId}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-violet-200 to-pink-200 flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-lg ">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 0 && (
              <>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold mb-4 mt-[-8rem]">
                    Title Of Quiz
                  </h2>
                  <div className="w-full max-w-sm">
                    <input
                      type="text"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="w-full p-4 border-gray-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300 ease-in-out transform hover:scale-105"
                      placeholder="Quiz Title"
                    />
                  </div>
                </div>
                <div className="w-full max-w-sm flex items-center">
                  <label className="flex items-center text-lg font-medium text-gray-700">
                    <span className="ml-16 mr-16">Include Score</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={gradingEnabled}
                        onChange={(e) => setGradingEnabled(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-4 ml-44 bg-gray-300 rounded-full shadow-inner ${
                          gradingEnabled ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`dot ml-44 absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${
                          gradingEnabled ? "transform translate-x-full" : ""
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
                <div className="w-full max-w-lg space-y-4">
                  <label className="flex items-center text-lg font-medium text-gray-700">
                    <span className="mr-16 ml-16">
                      Include start and end time?
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isTimed}
                        onChange={(e) => setIsTimed(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-4 bg-gray-300 rounded-full shadow-inner ${
                          isTimed ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${
                          isTimed ? "transform translate-x-full" : ""
                        }`}
                      ></div>
                    </div>
                  </label>
                  {isTimed && (
                    <div className="mt-2 ml-16 space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Start Time:
                        </label>
                        <input
                          type="datetime-local"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          placeholder="YYYY-MM-DD HH:MM"
                          className="w-48 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Time:
                        </label>
                        <input
                          type="datetime-local"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          placeholder="YYYY-MM-DD HH:MM"
                          className="w-48 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          pattern="\d{4}-\d{2}-\d{2} \d{2}:\d{2}"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 1 && (
              <div className="space-y-4 mt-[-10rem] mb-4">
                <h3 className="text-xl font-bold text-gray-700">
                  How do you want to create the questions?
                </h3>
                <div className="flex space-x-4">
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg text-white cursor-pointer ${
                      questionCreationMethod === "manual"
                        ? "bg-gray-800 border-4 border-blue-500"
                        : "bg-gray-800 opacity-50"
                    } `}
                    onClick={() => setQuestionCreationMethod("manual")}
                  >
                    <h4 className="text-xl font-bold mb-2">Manually</h4>
                    <p className="text-gray-300">
                      Create each question yourself.
                    </p>
                  </div>
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg text-white cursor-pointer ${
                      questionCreationMethod === "ai"
                        ? "bg-gray-800 border-4 border-blue-500"
                        : "bg-gray-800 opacity-50"
                    } `}
                    onClick={() => setQuestionCreationMethod("ai")}
                  >
                    <h4 className="text-xl font-bold mb-2">Using AI</h4>
                    <p className="text-gray-300">
                      Create questions from books, videos, or PDFs.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && questionCreationMethod === "manual" && (
              <div className="space-y-4 mt-[-10rem]">
                <h3 className="text-xl font-bold text-gray-700">
                  Select checking type:
                </h3>
                <div className="flex space-x-4">
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg transform transition duration-500 text-white cursor-pointer ${
                      checkingType === "automatic"
                        ? "bg-black border-4 border-blue-500"
                        : "bg-black opacity-50"
                    }`}
                    onClick={() => setCheckingType("automatic")}
                  >
                    <h4 className="text-xl font-bold mb-2">Automatic</h4>
                    <p>Only supports MCQ and subjective questions.</p>
                  </div>
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg transform transition duration-500 text-white cursor-pointer ${
                      checkingType === "manual"
                        ? "bg-black border-4 border-blue-500"
                        : "bg-black opacity-50"
                    }`}
                    onClick={() => setCheckingType("manual")}
                  >
                    <h4 className="text-xl font-bold mb-2">Manual</h4>
                    <p>
                      Supports all question types, but requires manual grading.
                    </p>
                  </div>
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg transform transition duration-500 text-white cursor-pointer ${
                      checkingType === "AI"
                        ? "bg-black border-4 border-blue-500"
                        : "bg-black opacity-50"
                    }`}
                    onClick={() => setCheckingType("AI")}
                  >
                    <h4 className="text-xl font-bold mb-2">AI</h4>
                    <p>
                      Supports all question types and automatic grading using AI.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && questionCreationMethod === "ai" && (
              <div className="space-y-4 mt-[-10rem]">
                <h3 className="text-xl font-bold text-gray-700">
                  Select checking type:
                </h3>
                <div className="flex space-x-4">
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg transform transition duration-500 text-white cursor-pointer ${
                      checkingType === "manual"
                        ? "bg-black border-4 border-blue-500"
                        : "bg-black opacity-50"
                    }`}
                    onClick={() => setCheckingType("manual")}
                  >
                    <h4 className="text-xl font-bold mb-2">Manual</h4>
                    <p>
                      Supports all question types, but requires manual grading.
                    </p>
                  </div>
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg transform transition duration-500 text-white cursor-pointer ${
                      checkingType === "AI"
                        ? "bg-black border-4 border-blue-500"
                        : "bg-black opacity-50"
                    }`}
                    onClick={() => setCheckingType("AI")}
                  >
                    <h4 className="text-xl font-bold mb-2">AI</h4>
                    <p>
                      Supports all question types and automatic grading using AI.
                    </p>
                  </div>
                </div>
              </div>
            )}

              <div className="flex justify-between mt-16">
                <button
                  type="button"
                  onClick={previousStep}
                  className={`py-2 px-4 mt-10 bg-slate-400 text-white font-bold rounded-full hover:bg-slate-500 transition duration-300 ${
                    step === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={step === 0}
                >
                  <Image
                    src="/arrow-sm-left-svgrepo-com.svg"
                    width={50}
                    height={50}
                    alt="Previous"
                  />
                </button>

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className={`py-2 px-4 mt-10 bg-slate-400 text-white font-bold rounded-full hover:bg-slate-500 transition duration-300 ${
                      step === 2 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={step === 2}
                  >
                    <Image
                      src="/arrow-sm-right-svgrepo-com.svg"
                      width={50}
                      height={50}
                      alt="Next"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="py-2 px-4 mt-10 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition duration-300"
                  >
                    Submit
                  </button>
                )}
              </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateQuiz;
