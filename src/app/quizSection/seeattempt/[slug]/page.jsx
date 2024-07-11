"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const QuizResponsesPage = ({ params }) => {
  const router = useRouter();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizscores, setQuizscores] = useState(0);
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(
          `/api/quiz/checkquiz?quizId=${params.slug}`
        );

        console.log(response.data.responses);
        setResponses(response.data.responses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching responses:", error);
        setLoading(false);
      }
    };
    const fetchQuizDetails = async () => {
      try {
        const quiz = await axios.get(`/api/quiz/getquiz?quizId=${params.slug}`);
        console.log(quiz.data);
        setQuizscores(quiz.data.quiz.totalScore);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
      }
    };

    if (params.slug) {
      fetchResponses();
      fetchQuizDetails();
    }
  }, [params.slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (responses.length === 0) {
    return <div>No responses found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-violet-200 to-pink-200 min-h-screen min-w-full">
        <div className="container mx-auto p-4">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold mb-4 my-10">Quiz Responses</h1>
            <div
              className="p-2 bg-blue-400 text-white hover:bg-blue-600 cursor-pointer"
              onClick={() => {
                router.push(`/quizSection/Leaderboard?quizId=${params.slug}`);
              }}
            >
              Leaderboard
            </div>
          </div>
          <ul>
            {responses.map((response) => (
              <li key={response._id} className="mb-2">
                <div className="p-4 border border-blue-400 rounded-full flex justify-between items-center">
                  <button
                    onClick={() =>
                      router.push(
                        `/quizSection/check/${params.slug}/${response.userId._id}`
                      )
                    }
                    className="text-blue-500 underline"
                  >
                    {response.userId.userName}
                  </button>

                  <span>
                    {response.status === "declared" && (
                      <span>
                        {response.totalScore} / {quizscores}
                      </span>
                    )}
                    <span className="ml-2 text-sm text-gray-500">
                      {response.status}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuizResponsesPage;
