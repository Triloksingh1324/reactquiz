'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import jwt from 'jsonwebtoken';
import axios from 'axios';

const QuizResultPage = ({ params }) => {
  const router = useRouter();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {

        const userId='667ff8d052a4e2f601b4a9a9';// to change for checking purposes only
        console.log(params.slug);
        
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
  }, [params.slug,router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!response) {
    return <div>Quiz result not found.</div>;
  }

  const { status, answers, quizId: quiz } = response;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          {status === 'pending' ? (
            <div className="bg-yellow-500 text-white px-4 py-2 rounded-md">Status: Pending</div>
          ) : (
            <div className="bg-green-500 text-white px-4 py-2 rounded-md">
              Marks Obtained: {response.totalMarks} / {quiz.totalMarks}
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Quiz Questions and Answers</h2>
        {quiz.questions.map((question, index) => {
          const userAnswer = answers.find(ans => ans.questionId === question._id);
          const isCorrect = userAnswer?.answer === question.correctAnswer;

          return (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md">
              <p className="text-lg font-semibold mb-2">{`${index + 1}. ${question.content}`}</p>
              <p className="text-sm text-gray-600">Marks: {question.score}</p>
              <p className="text-sm mb-2">
                Your Answer: {userAnswer ? userAnswer.answer : 'Not Answered'}
              </p>
              {status === 'done' && !isCorrect && question.correctAnswer && (
                <p className="text-sm text-red-500">Correct Answer: {question.correctAnswer}</p>
              )}
              {status === 'done' && (
                <p className="text-sm text-gray-600">
                  Marks Obtained: {userAnswer?.marksObtained || 0} / {question.score}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResultPage;
