"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { authenticateUser } from '../../../middleware/authenticate_user';

const QuizDetailPage = ({ params }) => {
  const router = useRouter();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { authenticated, userId } = await authenticateUser();
      
      if (!authenticated) {
        // router.push('/login');
        return;
      }
      setUserId(userId);
    };

    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`/api/quiz/getquiz?quizId=${params.slug}`);
        setQuiz(response.data.quiz);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    if (params.slug) {
      fetchUserData();
      fetchQuizDetails();
    }
  }, [params.slug]);

  useEffect(() => {
    if (quiz && userId) {
      setIsAuthorized(quiz.creatorId === userId);
    }
  }, [quiz, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found.</div>;
  }

  const { questions, creatorId, isPublished } = quiz;

  const handlePrintQuiz = () => {
    window.print();
  };

  const handleGenerateQuiz = async () => {
    try {
      await axios.put(`/api/quiz/createquestion`, {
        quizId: params.slug,
        isPublished: true
      });
      setQuiz(prevState => ({
        ...prevState,
        isPublished: true
      }));
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  };

  const handleEditQuestions = () => {
    router.push(`/quizSection/createquestion?quizId=${params.slug}`);
  };

  if (!isAuthorized) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Details</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          {isAuthorized && (
            <>
              {!isPublished && (
                <button
                  onClick={handleGenerateQuiz}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Generate Quiz
                </button>
              )}
              <button
                onClick={handleEditQuestions}
                className={`bg-gray-500 text-white px-4 py-2 rounded-md mr-2 ${isPublished ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPublished}
              >
                Edit Questions
              </button>
            </>
          )}
          <button
            onClick={handlePrintQuiz}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Print Quiz
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="w-3/4 pr-4">
          <h2 className="text-xl font-bold mb-4">Quiz Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md">
              <p className="text-lg font-semibold mb-2">{`${index + 1}. ${question.content}`}</p>
              <p className="text-sm text-gray-600">Marks: {question.score}</p>
              {question.type === 'MCQ' && (
                <ul className="list-disc ml-6">
                  {question.options.map((option, optIndex) => (
                    <li key={optIndex} className="mb-1">{option.optionText}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="w-1/4">
          <h2 className="text-xl font-bold mb-4">Quiz Controls</h2>
          <div className="mb-4">
            <button
              disabled={isAuthorized}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${isAuthorized ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAuthorized ? 'Attempt Disabled' : 'Attempt Quiz'}
            </button>
          </div>
          <div>
            <button
              onClick={handlePrintQuiz}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Print Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;
