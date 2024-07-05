'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const AttemptQuizPage = ({ params }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`/api/quiz/getquiz?quizId=${params.slug}`);
        setQuiz(response.data.quiz);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
        setLoading(false);
      }
    };

    const checkUniqueAttempt = async () => {
      try {
        const token = getCookie('accessToken');
        const decodedToken = jwt.decode(token);
        if (!decodedToken) {
          console.error('Invalid token.');
          router.push('/login');
          return;
        }

        setUserId(decodedToken.id);
        const reattempt = await axios.get(`/api/quiz/attempt?userId=${userId}&quizId=${params.slug}`);
        if (reattempt.data.success) {
          console.log("Quiz already attempted");
          router.push(`/quizSection/getresult/${params.slug}`);
        }
      } catch (error) {
        console.error('Error checking quiz attempt:', error);
      }
    };

    if (params.slug) {
      fetchQuizDetails();
      checkUniqueAttempt();
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, [params.slug, router, userId]);

  const handleChange = (questionId, answer) => {
    const existingResponse = responses.find(response => response.questionId === questionId);
    if (existingResponse) {
      setResponses(
        responses.map(response =>
          response.questionId === questionId ? { ...response, answer } : response
        )
      );
    } else {
      setResponses([...responses, { questionId, answer }]);
    }
  };

  const handleSubmit = async () => {
    if (!quiz.isPublished) {
      alert('Quiz is not published yet.');
      return;
    }
    try {
      await axios.post('/api/quiz/attempt', {
        quizId: params.slug,
        userId,
        responses,
      });
      router.push(`/quizSection/getresult/${params.slug}`);
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found.</div>;
  }
  const startTime = quiz.startTime ? new Date(quiz.startTime) : null;
  const endTime = quiz.endTime? new Date(quiz.endTime):null;


  if (!quiz.isPublished) {
    return <div>The quiz is not published yet.</div>;
  }
  if ((startTime && currentTime < startTime) ||(endTime && currentTime > endTime)) {
    return <div>The quiz is not available at this time.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <div className="flex flex-col space-y-4">
        {quiz.questions.map((question, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-md">
            <p className="text-lg font-semibold mb-2">{`${index + 1}. ${question.content}`}</p>
            {question.type === 'MCQ' ? (
              question.options.map((option, i) => (
                <div key={i} className="mb-2">
                  <input
                    type="radio"
                    id={`q${index}o${i}`}
                    name={`q${index}`}
                    value={option.optionText}
                    onChange={() => handleChange(question._id, option.optionText)}
                  />
                  <label htmlFor={`q${index}o${i}`}>{option.optionText}</label>
                </div>
              ))
            ) : (
              <input
                type="text"
                className="border p-2 w-full"
                onChange={(e) => handleChange(question._id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Submit Responses
      </button>
    </div>
  );
};

export default AttemptQuizPage;
