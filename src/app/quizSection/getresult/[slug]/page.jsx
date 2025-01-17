'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, getCookies } from 'cookies-next';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { BallTriangle } from 'react-loader-spinner';
const QuizResultPage = ({ params }) => {
  const router = useRouter();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const cook = getCookies();
        console.log(cook);
        const token = getCookie('accessToken');
        console.log("Token:", token);

        if (!token) {
          console.error('Access token not found.');
          return;
        }

        const decodedToken = jwt.decode(token);
        console.log("Decoded Token:", decodedToken);

        if (!decodedToken) {
          console.error('Invalid token.');
          router.push('/login');
          return;
        }

        const userId = decodedToken.id; 
        console.log("User ID:", userId);

        const result = await axios.get(`/api/quiz/getresult?quizId=${params.slug}&userId=${userId}`);
        setResponse(result.data.response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz result:', error);
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchQuizResult();
    }
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-r from-violet-200 to-pink-200 min-h-screen">
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
      </div>
    );
  }

  if (!response) {
    return <div>Quiz result not found.</div>;
  }

  console.log("Response:", response);
  const { status, answers, quizId: quiz, totalScore } = response;
  
  return (
    <>
    <Navbar/>
    <div className="container mx-auto md:mt-20 p-4 bg-gradient-to-r from-violet-200 to-pink-200 min-w-full min-h-screen mb-10">
      <div className='md:mx-20'>
      <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
      <div className="flex flex-row justify-between items-center mb-4">
        {status === 'pending' ? (
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-md">Status: Pending</div>
        ) : (
          <div className="bg-green-500 text-white px-4 py-2 rounded-md">
            Marks Obtained: {totalScore} / {quiz.totalScore}  
          </div>
        )}
        <div className='p-2 bg-blue-400 text-white hover:bg-blue-600 cursor-pointer' onClick={()=>{router.push(`/quizSection/Leaderboard?quizId=${params.slug}`)}}>Leaderboard</div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Quiz Questions and Answers</h2>
        {quiz.questions.map((question, index) => {
          const userAnswer = answers.find(ans => ans.questionId === question._id);
          const isCorrect = userAnswer?.isCorrect;

          return (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md">
              <p className="text-lg font-semibold mb-2">{`${index + 1}. ${question.content}`}</p>
              <p className="text-sm text-gray-600">Marks: {question.score}</p>
              {status === 'declared' && (
                <>
                 {isCorrect === null ? (
                  <>
                    <p className="text-md mb-2">
                      Your Answer: {userAnswer ? userAnswer.answer : 'Not Answered'}
                      
                    </p>
                     <p className="text-md text-green-500">Suggestion: {userAnswer? userAnswer.suggestion: ""}</p>
                     </>
                  ) : (
                    <p className={`text-sm mb-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      Your Answer: {userAnswer ? userAnswer.answer : 'Not Answered'} {isCorrect ? '✔' : '✘'}
                    </p>
                  )}
                  {!isCorrect && question.correctAnswer && (
                    <p className="text-sm text-gray-600">Correct Answer: {question.correctAnswer}</p>
                  )}
                  {question.suggestion && (
                        <p className="text-sm text-green-500">Suggestion: {userAnswer? userAnswer.suggestion: ""}</p>
                      )}
                  <p className="text-sm text-gray-600">
                    Marks Obtained: {userAnswer?.score || 0} / {question.score}
                  </p>
                </>
              )}
              {status === 'pending' && (
                <p className="text-sm text-gray-600">Your Answer: {userAnswer ? userAnswer.answer : 'Not Answered'}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default QuizResultPage;
