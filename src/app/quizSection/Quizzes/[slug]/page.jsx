"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BallTriangle } from 'react-loader-spinner';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const QuizDetailPage = ({ params }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const authenticated = await axios.get(`/api/middleware?quizId=${params.slug}`);
      if (!authenticated) {
        return "You are not authenticated";
      }
      setIsAuthorized(true);
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

  const handlePrintQuiz = () => {
    const printableContent = document.getElementById('printable-questions').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printableContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
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
      setSuccessMessage('Your quiz has been generated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000); 
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  };

  const handleEditQuestions = () => {
    router.push(`/quizSection/createquestion?quizId=${params.slug}`);
  };

  const handleShareQuiz = () => {
    const shareLink = `${process.env.NEXT_PUBLIC_ACCESS_DOMAIN}/quizSection/attemptQuiz/${params.slug}`;
  const textArea = document.createElement("textarea");
  textArea.value = shareLink;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    alert(`Quiz link copied to clipboard: ${shareLink}\nYou can attempt the quiz using this link.`);
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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

  if (!quiz) {
    return <div>Quiz not found.</div>;
  }

  const { questions, isPublished } = quiz;

  if (!isAuthorized) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <>
      <Navbar />

      <div className='bg-gradient-to-r from-violet-200 to-pink-200 min-h-screen md:mt-20'>
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
                  {!isPublished ? (
                    <button
                      onClick={handleEditQuestions}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Edit Questions
                    </button>
                  ) : (
                    <button
                      onClick={handleShareQuiz}
                      className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Share
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
              <p className="font-bold">{successMessage}</p>
            </div>
          )}
          <div className="flex flex-col md:flex-row">
            <div id="printable-questions" className="w-full md:w-3/4 pr-4">
              <h2 className="text-xl font-bold mb-4">Quiz Questions</h2>
              {questions.map((question, index) => (
                <div key={index} className="mb-6 p-4 border-gray-300 rounded-md">
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
            {isAuthorized && !isPublished && (
              <div className="w-full md:w-1/4 mt-4 md:mt-0">
                <h2 className="text-xl font-bold mb-4">Quiz Controls</h2>
                <button
                  onClick={handlePrintQuiz}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Print Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuizDetailPage;
