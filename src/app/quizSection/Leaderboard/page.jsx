"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer"
import { useSearchParams } from 'next/navigation'
const Leaderboard = () => {
    const searchParams = useSearchParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const quizId  = searchParams.get('quizId');
  useEffect(() => {
    console.log("quizzz",quizId)
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`/api/leaderboard?quizId=${quizId}`);
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [quizId]);
   console.log("Leaderboarrd",leaderboard);
  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center bg-gradient-to-r from-purple-300 to-blue-300 min-h-screen py-8  ">
    <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 ">Leaderboard</h2>
      <ul className="divide-y divide-gray-200">
        {leaderboard.map((entry, index) => (
          <li key={entry.userId._id} className="py-4 flex justify-between items-center">
            <span className="font-medium text-lg">
              {index + 1}. {entry.userId.userName}
            </span>
            <span className="text-xl font-semibold text-blue-600">
              Score: {entry.totalScore}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
  <Footer/>
  </>
  );
};

export default Leaderboard;
