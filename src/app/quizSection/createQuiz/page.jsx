"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../../helpers/axiosInstance';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CreateQuiz = () => {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState('');
  const [checkingType, setCheckingType] = useState('');
  const [gradingEnabled, setGradingEnabled] = useState(false);
  const [isTimed, setIsTimed] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questionCreationMethod, setQuestionCreationMethod] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/quiz/createquiz', {
        title: quizTitle,
        checkingType,
        gradingEnabled,
        isTimed,
        startTime,
        endTime,
      });
      const { quizId } = response.data;
      router.push(`/quizSection/createquestion?quizId=${quizId}`);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-tr from-red-300 to-yellow-200 flex flex-col items-center py-10">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">Get Started</h1>
        <div className="w-full max-w-lg space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Before we get started</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">What is the title of your quiz?</label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={gradingEnabled}
                  onChange={(e) => setGradingEnabled(e.target.checked)}
                  className="mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                Is the quiz graded?
              </label>
            </div>
            <div>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={isTimed}
                  onChange={(e) => setIsTimed(e.target.checked)}
                  className="mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                Include start and end time?
              </label>
              {isTimed && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time:</label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time:</label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-700">How do you want to create the questions?</h3>
              <div className="flex space-x-4">
                <div
                  className={`max-w-sm p-6 rounded-xl shadow-lg text-white cursor-pointer ${questionCreationMethod === 'manual' ? 'bg-gray-800 border-4 border-blue-500' : 'bg-gray-800 opacity-50'} `}
                  onClick={() => setQuestionCreationMethod('manual')}
                >
                  <h4 className="text-xl font-bold mb-2">Manually</h4>
                  <p className="text-gray-300">Create each question yourself.</p>
                </div>
                <div
                  className={`max-w-sm p-6 rounded-xl shadow-lg text-white cursor-pointer ${questionCreationMethod === 'ai' ? 'bg-gray-800 border-4 border-blue-500' : 'bg-gray-800 opacity-50'} `}
                  onClick={() => setQuestionCreationMethod('ai')}
                >
                  <h4 className="text-xl font-bold mb-2">Using AI</h4>
                  <p className="text-gray-300">Create questions from books, videos, or PDFs.</p>
                </div>
              </div>
            </div>
            {questionCreationMethod === 'manual' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-700">Select checking type:</h3>
                <div className="flex space-x-4">
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg transform transition duration-500 text-white cursor-pointer ${checkingType === 'automatic' ? 'bg-black border-4 border-blue-500' : 'bg-black opacity-50'}`}
                    onClick={() => setCheckingType('automatic')}
                  >
                    <h4 className="text-xl font-bold mb-2">Automatic</h4>
                    <p>Only supports MCQ and subjective questions.</p>
                  </div>
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg transform transition duration-500 text-white cursor-pointer ${checkingType === 'manual' ? 'bg-black border-4 border-blue-500' : 'bg-black opacity-50'}`}
                    onClick={() => setCheckingType('manual')}
                  >
                    <h4 className="text-xl font-bold mb-2">Manual</h4>
                    <p>Supports all question types, but requires manual grading.</p>
                  </div>
                  <div
                    className={`max-w-sm p-6 rounded-xl shadow-lg transform transition duration-500 text-white cursor-pointer ${checkingType === 'ai' ? 'bg-black border-4 border-blue-500' : 'bg-black opacity-50'}`}
                    onClick={() => setCheckingType('ai')}
                  >
                    <h4 className="text-xl font-bold mb-2">AI</h4>
                    <p>Leverages AI to assist with grading and feedback.</p>
                  </div>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Next
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateQuiz;
