'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CheckUserResponsePage = ({ params }) => {
  const [response, setResponse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchResponseAndQuestions = async () => {
      try {
        const { quizId, userId } = params;
        console.log('Fetching response for quiz:', quizId, 'and user:', userId);
        const responseRes = await axios.get(`/api/quiz/checkresponse?quizId=${quizId}&userId=${userId}`);
        const questionsRes = await axios.get(`/api/quiz/getquiz?quizId=${quizId}`);
        console.log("questionsRes: ", questionsRes);

        const response = responseRes.data.response;
        const questions = questionsRes.data.quiz.questions;

        // Set initial scores
        const initialScores = {};
        response.answers.forEach(answer => {
          const question = questions.find(q => q._id === answer.questionId);
          if (question.type === 'MCQ' && answer.answer === question.correctAnswer) {
            initialScores[answer.questionId] = question.score; // Automatically award full score for correct MCQ answers
          } else {
            initialScores[answer.questionId] = answer.score || 0; // Set existing score or 0
          }
        });

        setResponse(response);
        setQuestions(questions);
        setScores(initialScores);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user response or questions:', error);
        setLoading(false);
      }
    };

    fetchResponseAndQuestions();
  }, [params]);

  const handleScoreChange = (questionId, score) => {
    setScores({ ...scores, [questionId]: score });
  };

  const handleAddSuggestion = (questionId, answerIndex) => {
    console.log("Add suggestion for question:", questionId, "answer index:", answerIndex);
  };

  const handleSubmit = async () => {
    try {
      const { quizId, userId } = params;
      await axios.put(`/api/quiz/checkquiz`, {
        quizId,
        userId,
        scores,
        status: 'declared',
      });
      alert('Response updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating response:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!response) {
    return <div>No response found for this user.</div>;
  }

  if (response.status !== 'pending') {
    return <div>This response has already been checked.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Responses for {response.userId.userName}</h1>
      <ul>
        {response.answers.map((answer, index) => {
          const question = questions.find(q => q._id === answer.questionId);
          if (!question) return null;
          const isCorrect = answer.isCorrect !== null ? answer.isCorrect : false;
          const answerColor = isCorrect ? 'text-green-600' : 'text-red-600';
          const correctAnswer = question.correctAnswer;

          return (
            <li key={index} className="mb-4">
              <div className="p-2 border rounded-md">
                <p className="mb-2"><strong>Question {index + 1}:</strong> {question.content}</p>
                {question.type === 'MCQ' && (
                  <ul className="mb-2">
                    {question.options.map((option, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="font-bold mr-2">{idx + 1}.</span>
                        <span className={`${answer.answer === option.optionText ? answerColor : ''} mr-2`}>{option.optionText}</span>
                        {correctAnswer === option.optionText && <span className="text-green-600">(Correct)</span>}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mb-2"><strong>User Answer:</strong> <span className={answerColor}>{answer.answer}</span></p>
                <p className="mb-2"><strong>Score:</strong> {scores[answer.questionId]}</p>
                {question.type === 'Subjective' && (
                  <div className="mb-2">
                    <label className="block">
                      Score (out of {question.score}):
                      <input
                        type="number"
                        value={scores[answer.questionId] || ''}
                        onChange={(e) => handleScoreChange(answer.questionId, Math.min(e.target.value, question.score))}
                        max={question.score}
                        min="0"
                        className="mt-1 p-2 border rounded-md"
                      />
                    </label>
                  </div>
                )}
                <button onClick={() => handleAddSuggestion(question._id, index)} className="mt-2 p-2 bg-blue-500 text-white rounded">Add Suggestion</button>
                {/* //have to correct this later */}
              </div>
            </li>
          );
        })}
      </ul>

      <button onClick={handleSubmit} className="mt-4 p-2 bg-blue-500 text-white rounded">Submit</button>
      <button onClick={() => router.back()} className="mt-4 ml-2 p-2 bg-gray-500 text-white rounded">Go Back</button>
    </div>
  );
};

export default CheckUserResponsePage;
