'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const AttemptQuizPage = ({ params }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('667ff8d052a4e2f601b4a9a9');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        console.log(params.slug);
        const response = await axios.get(`/api/quiz/getquiz?quizId=${params.slug}`);
        console.log(response.data.quiz);
        setQuiz(response.data.quiz);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    // const decodeToken = () => {
    //   const accessToken = Cookies.get('accessToken');
    //   console.log('Access token:', accessToken);
    //   if (accessToken) {
    //     try {
    //       const decodedToken = jwt.decode(accessToken);
    //       setUserId(decodedToken.id);
    //     } catch (error) {
    //       console.error('Error decoding token:', error);
    //     }
    //   } else {
    //     router.push('/login');
    //   }
    // };

    if (params.slug) {
      fetchQuizDetails();
    }
    // decodeToken();
  }, [params.slug]);

  const handleChange = (questionId, answer) => {
    console.log(`Updating response for questionId ${questionId} with answer ${answer}`);
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
    try {
      console.log("checking", params.slug);
      const response = await axios.post('/api/quiz/attempt', {
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
