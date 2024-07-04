'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const QuizResponsesPage = ({ params }) => {
  const router = useRouter();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`/api/quiz/checkquiz?quizId=${params.slug}`);
        console.log(response.data.responses);
        setResponses(response.data.responses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching responses:', error);
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchResponses();
    }
  }, [params.slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (responses.length === 0) {
    return <div>No responses found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Responses</h1>
      <ul>
        {responses.map((response) => (
          <li key={response._id} className="mb-2">
            <div className="p-4 border rounded-full flex justify-between items-center">
              <button
                onClick={() => router.push(`/quizSection/check/${params.slug}/${response.userId._id}`)}
                className="text-blue-500 underline"
              >
                {response.userId.userName}
              </button>
              <span>
                {response.status === 'declared' && (
                  <span>
                    {response.totalScore} / {response.answers.reduce((acc, answer) => acc + answer.score, 0)}
                  </span>
                )}
                <span className="ml-2 text-sm text-gray-500">{response.status}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResponsesPage;
