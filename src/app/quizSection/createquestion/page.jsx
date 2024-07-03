"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const QuestionTypes = {
  MCQ: 'MCQ',
  FillUp: 'FillUp',
  Subjective: 'Subjective'
};

const CreateQuestions = () => {
  const router = useRouter();
  const urlParams = new URLSearchParams(window.location.search);
  const quizIdFromUrl = urlParams.get('quizId');
  const [questions, setQuestions] = useState([]);
  const [initialQuestions, setInitialQuestions] = useState([]);
  const [isGradingEnabled, setIsGradingEnabled] = useState(false);
  const [checkingType, setCheckingType] = useState('');

  useEffect(() => {
    if (!quizId) {
      router.push('/quizSection/createQuiz');
    } else {
      fetchQuizDetails();
      fetchQuestions();
    }
  }, [quizId, router]);

  const fetchQuizDetails = async () => {
    try {
      const response = await axios.get(`/api/quiz/getquiz?quizId=${quizId}`);
      setIsGradingEnabled(response.data.quiz.isGradingEnabled);
      setCheckingType(response.data.quiz.checkingType);
      console.log(checkingType);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/quiz/getquiz?quizId=${quizId}`);
      console.log(response.data.quiz.questions);
      setQuestions(response.data.quiz.questions || []);
      setInitialQuestions(response.data.quiz.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { type: '', content: '', options: [], correctAnswer: '', score: null }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'score') {
      newQuestions[index][field] = parseInt(value);
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].optionText = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push({ optionText: '' });
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleTypeSelection = (index, type) => {
    if (type === QuestionTypes.Subjective && checkingType === 'automatic') {
      return;
    }
    const newQuestions = [...questions];
    newQuestions[index].type = type;
    if (type === QuestionTypes.MCQ && newQuestions[index].options.length === 0) {
      newQuestions[index].options.push({ optionText: '' });
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedQuestions = questions.map(question => {
        if (question.type !== QuestionTypes.MCQ) {
          delete question.options;
        }
        return question;
      });

      const removedQuestions = initialQuestions.filter(
        initialQuestion => !formattedQuestions.some(
          question => question._id === initialQuestion._id
        )
      );
      await axios.put('/api/quiz/createquestion', {
        quizId,
        questions: formattedQuestions,
        removedQuestions,
      });

      router.push(`/quizSection/Quizzes/${quizId}`);
    } catch (error) {
      console.error('Error adding questions:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add Questions to Quiz</h1>
        <button
          type="submit"
          className={`bg-green-500 text-white px-4 py-2 rounded-md ${questions && questions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!questions || questions.length === 0}
          onClick={handleSubmit}
        >
          Submit Questions
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {!questions || questions.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Question
            </button>
          </div>
        ) : (
          <>
            {questions.map((question, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                  <div className="flex space-x-4">
                    {Object.values(QuestionTypes).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`p-4 border rounded-md cursor-pointer ${question.type === type ? 'border-blue-500' : 'border-gray-300'} ${type === QuestionTypes.Subjective && checkingType === 'automatic' ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => handleTypeSelection(index, type)}
                        disabled={type === QuestionTypes.Subjective && checkingType === 'automatic'}
                      >
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Content</label>
                  <input
                    type="text"
                    value={question.content}
                    onChange={(e) => handleQuestionChange(index, 'content', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {question.type === QuestionTypes.MCQ && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={option.optionText}
                            onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mr-2"
                            required
                          />
                          <input
                            type="radio"
                            name={`correctOption-${index}`}
                            value={option.optionText}
                            checked={question.correctAnswer === option.optionText}
                            onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                            className="form-radio"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddOption(index)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        Add Option
                      </button>
                    </div>
                  </>
                )}
                {question.type === QuestionTypes.FillUp && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                )}
                {isGradingEnabled && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                    <input
                      type="number"
                      value={question.score}
                      onChange={(e) => handleQuestionChange(index, 'score', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Remove Question
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
              >
              Add Question
              </button>
              </>
              )}
              </form>
              </div>
              );
              };
              
              export default CreateQuestions;
              