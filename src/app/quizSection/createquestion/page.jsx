"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BallTriangle } from "react-loader-spinner";
const QuestionTypes = {
  MCQ: "MCQ",
  FillUp: "FillUp",
  Subjective: "Subjective",
};

const CreateQuestions = () => {
  const router = useRouter();
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [initialQuestions, setInitialQuestions] = useState([]);
  const [isGradingEnabled, setIsGradingEnabled] = useState(false);
  const [checkingType, setCheckingType] = useState("");
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const quizIdFromUrl = urlParams.get("quizId");
      setQuizId(quizIdFromUrl);

      if (!quizIdFromUrl) {
        router.push("/quizSection/createQuiz");
      } else {
        fetchQuizDetails(quizIdFromUrl);
        fetchQuestions(quizIdFromUrl);
      }
    }
  }, [router]);

  const fetchQuizDetails = async (quizId) => {
    try {
      const response = await axios.get(`/api/quiz/getquiz?quizId=${quizId}`);
      setIsGradingEnabled(response.data.quiz.grades);
      setCheckingType(response.data.quiz.checkingType);
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  const fetchQuestions = async (quizId) => {
    try {
      const response = await axios.get(`/api/quiz/getquiz?quizId=${quizId}`);
      setQuestions(response.data.quiz.questions || []);
      setInitialQuestions(response.data.quiz.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { type: "", content: "", options: [], correctAnswer: "", score: null },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "score") {
      newQuestions[index][field] = parseInt(value);
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].optionText = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push({ optionText: "" });
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleTypeSelection = (index, type) => {
    if (type === QuestionTypes.Subjective && checkingType === "automatic") {
      return;
    }
    const newQuestions = [...questions];
    newQuestions[index].type = type;
    if (
      type === QuestionTypes.MCQ &&
      newQuestions[index].options.length === 0
    ) {
      newQuestions[index].options.push({ optionText: "" });
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const formattedQuestions = questions.map((question) => {
        if (question.type !== QuestionTypes.MCQ) {
          delete question.options;
        }
        return question;
      });

      const removedQuestions = initialQuestions.filter(
        (initialQuestion) =>
          !formattedQuestions.some(
            (question) => question._id === initialQuestion._id
          )
      );

      await axios.put("/api/quiz/createquestion", {
        quizId,
        questions: formattedQuestions,
        removedQuestions,
      });

      router.push(`/quizSection/Quizzes/${quizId}`);
    } catch (error) {
      console.error("Error adding questions:", error);
    }
  };

  return (
    <>
    {loader?(      <div className="flex justify-center items-center bg-gradient-to-r from-violet-200 to-pink-200 min-h-screen">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>):(
    <>
    <Navbar/>
    <div className="container p-4 md:mt-20 bg-gradient-to-r from-violet-200 to-pink-200 min-w-full min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm md:text-2xl font-bold">Add Questions to Quiz</h1>
        <button
          type="submit"
          className={`bg-green-500 text-white font-bold text-sm  px-4 py-2 rounded-2xl ${
            questions && questions.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!questions || questions.length === 0}
          onClick={handleSubmit}
        >
          Create
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {!questions || questions.length === 0 ? (
          <div className="flex min-h-[70vh] justify-center items-center">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-blue-500 text-white px-5 py-4 rounded-xl hover:bg-blue-400"
            >
              Add Question
            </button>
          </div>
        ) : (
          <div className="space-y-6 min-w-full">
            {questions.map((question, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md md:mx-20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Question {index + 1}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Remove
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type
                  </label>
                  <div className="flex space-x-4">
                    {Object.values(QuestionTypes).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`p-4 border rounded-md cursor-pointer ${
                          question.type === type
                            ? "border-blue-500"
                            : "border-gray-300"
                        } ${
                          type === QuestionTypes.Subjective &&
                          checkingType === "automatic"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        onClick={() => handleTypeSelection(index, type)}
                        disabled={
                          type === QuestionTypes.Subjective &&
                          checkingType === "automatic"
                        }
                      >
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Content
                  </label>
                  <textarea
                    value={question.content}
                    onChange={(e) =>
                      handleQuestionChange(index, "content", e.target.value)
                    }
                    className="w-full p-4 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {question.type === QuestionTypes.MCQ && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center mb-2"
                        >
                          <input
                            type="text"
                            value={option.optionText}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md mr-2"
                            required
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddOption(index)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        Add Option
                      </button>
                    </div>
                  </>
                )}
                {(question.type === QuestionTypes.FillUp ||
                  question.type === QuestionTypes.MCQ) && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                )}
                {isGradingEnabled && (
                  <div className="mb-4 flex ">
                    <label className="block text-lg bg-orange-400 pl-10 pr-20 py-4 rounded-2xl font-medium max-w-10 text-white mb-2 mr-4">
                      Score
                    </label>
                    <select
                      value={question.score}
                      onChange={(e) =>
                        handleQuestionChange(index, "score", e.target.value)
                      }
                      className="w-40 p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Score</option>
                      {[...Array(20).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-blue-500 text-white px-4 py-2 mb-16 rounded-md"
              >
                Add Question
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
    <Footer />
    </>)}
    </>
  );
};

export default CreateQuestions;
