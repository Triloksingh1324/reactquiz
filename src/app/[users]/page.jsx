"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../helpers/axiosInstance";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserPage = ({ params }) => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `/api/users/userdetail?userId=${params.users}`
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetail();
  }, [params]);

  const handleQuizClick = (quizId, type) => {
    const route =
      type === "created"
        ? `/quizSection/seeattempt/${quizId}`
        : `/quizSection/getresult/${quizId}`;
    router.push(route);
  };

  return (
    <>
      <Navbar />
      <div className="container md:mt-20 mx-auto p-6 bg-gradient-to-r from-violet-200 to-pink-200 min-w-full min-h-screen ">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-transparent mt-10 mb-6">
          {userDetails?.userName}
        </h1>
        {userDetails && (
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="flex-1 mb-6 md:mb-0 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                Created Quizzes
              </h2>
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 text-left text-blue-700 border-b-2">
                        Title
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDetails.quizzesCreated.map((quiz) => (
                      <tr
                        key={quiz._id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleQuizClick(quiz.quiz, "created")}
                      >
                        <td className="py-2 border-b">{quiz.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-purple-700">
                Taken Quizzes
              </h2>
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 text-left text-purple-700 border-b-2">
                        Title
                      </th>
                      <th className="py-2 text-left text-purple-700 border-b-2">
                        Status
                      </th>
                      <th className="py-2 text-left text-purple-700 border-b-2">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDetails.quizzesTaken.map((quiz) => (
                      <tr
                        key={quiz._id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleQuizClick(quiz.quiz, "taken")}
                      >
                        <td className="py-2 border-b">{quiz.title}</td>
                        <td className="py-2 border-b">{quiz.status}</td>
                        <td className="py-2 border-b">
                          {quiz.score ?? "Pending"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserPage;
