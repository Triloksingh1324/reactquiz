"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProgressBar } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAttemptingQuiz, setIsAttemptingQuiz] = useState(false);
  const [quizId, setQuizId] = useState("");

  const onCreate = () => {
    setLoading(true);
    router.push("quizSection/createQuiz");
  };

  const onAttempt = () => {
    setIsAttemptingQuiz(true);
  };

  const handleAttemptQuiz = () => {
    if (quizId.trim()) {
      router.push(`quizSection/attemptQuiz/${quizId}`);
    } else {
      alert("Please enter a valid Quiz ID");
    }
  };

  return (
    <>
      
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow bg-gradient-to-r from-fuchsia-300 to-indigo-600 flex justify-center items-center justify-evenly py-10">
            {isAttemptingQuiz ? (
              <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
                <label className="text-2xl font-bold mb-4">Enter Quiz ID</label>
                <input
                  type="text"
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  className="mb-4 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAttemptQuiz}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                  Attempt Quiz
                </button>
              </div>
            ) : (
              <div className="md:px-4 md:grid md:grid-cols-2 lg:grid-cols-2 gap-20 space-y-4 md:space-y-0">
                <div
                  className="max-w-sm bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-500"
                  onClick={onCreate}
                >
                  <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>
                  <p className="text-gray-700 mb-4">
                    Easily create quizzes tailored to your needs. Choose from
                    multiple question types, set scoring criteria, and customize
                    the content and checking type.
                  </p>
                </div>
                <div
                  className="max-w-sm bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-500"
                  onClick={onAttempt}
                >
                  <h2 className="text-2xl font-bold mb-4">Attempt Quiz</h2>
                  <p className="text-gray-700 mb-4">
                    Test your knowledge by attempting quizzes. Answer
                    multiple-choice questions, fill in the blanks, and submit your
                    responses to see how you score.
                  </p>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
        {loading ? (
        <div className="flex items-center justify-center">
          <ProgressBar
            height={100}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        null
      )}
    </>
  );
}
