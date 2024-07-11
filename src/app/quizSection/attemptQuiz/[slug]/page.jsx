'use client';

import React, { useEffect, useState,useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Image from 'next/image';
import { BallTriangle } from 'react-loader-spinner';

const AttemptQuizPage = ({ params }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [checkingType, setCheckingType] = useState("manual");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const textareaRef = useRef(null);
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`/api/quiz/getquiz?quizId=${params.slug}`);
        setQuiz(response.data.quiz);
        setCheckingType(response.data.quiz.checkingType);
        
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

    const loadSavedResponses = () => {
      const savedResponses = JSON.parse(localStorage.getItem('responses'));
      if (savedResponses) {
        setResponses(savedResponses);
      }
    };

    if (params.slug) {
      fetchQuizDetails();
      checkUniqueAttempt();
      loadSavedResponses();
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, [params.slug, router, userId]);

  useEffect(() => {
    localStorage.setItem('responses', JSON.stringify(responses));
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [responses]);

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

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz.isPublished) {
      alert('Quiz is not published yet.');
      return;
    }
    try {
      if (checkingType === "AI") {
        axios.post('/api/quiz/checkai', {
          quizId: params.slug,
          userId,
          responses,
        })
        .then(() => {
          localStorage.removeItem('responses');
        })
        .catch((error) => {
          console.error('Error submitting responses:', error);
        });
      } else {
        axios.post('/api/quiz/attempt', {
          quizId: params.slug,
          userId,
          responses,
        })
        .then(() => {
          localStorage.removeItem('responses');
        })
        .catch((error) => {
          console.error('Error submitting responses:', error);
        });
      }
    
      // Push to the result page immediately
      router.push(`/quizSection/getresult/${params.slug}`);
    } 
    catch (error) {
      console.error('Error initiating request:', error);
    }
    
  }
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

  if (!quiz) {
    return (<><div className='flex flex-col justify-center items-center  min-h-screen'>
      <h2 className='font-bold text-2xl'>Quiz not found.</h2>
    <div className='mt-10 bg-blue-500 p-4 rounded-xl text-white cursor-pointer' onClick={()=>{router.push("/")}}>Home Page</div>
    </div>
      </>
    );
  }

  const startTime = quiz.startTime ? new Date(quiz.startTime) : null;
  const endTime = quiz.endTime ? new Date(quiz.endTime) : null;

  if (!quiz.isPublished) {
    return <div>The quiz is not published yet.</div>;
  }
  if ((startTime && currentTime < startTime) || (endTime && currentTime > endTime)) {
    return <div>The quiz is not available at this time.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="container p-4 bg-gradient-to-r from-violet-200 to-pink-200 min-w-full min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center items-start">{quiz.title}</h1>
      <div className='flex flex-col min-w-full justify-center items-center'>
        <div className="w-full max-w-[60vw]">
          <div className="p-6 border-2  border-cyan-300 rounded-2xl">
            <p className="text-lg font-semibold mb-4 text-center">{`${currentQuestionIndex + 1}. ${currentQuestion.content}`}</p>
            {currentQuestion.type === 'MCQ' ? (
              currentQuestion.options.map((option, i) => (
                <div key={i} className="mb-2 flex ">
                  <input
                    type="radio"
                    id={`q${currentQuestionIndex}o${i}`}
                    name={`q${currentQuestionIndex}`}
                    value={option.optionText}
                    checked={responses.find(response => response.questionId === currentQuestion._id)?.answer === option.optionText}
                    onChange={() => handleChange(currentQuestion._id, option.optionText)}
                  />
                  <label htmlFor={`q${currentQuestionIndex}o${i}`} className="ml-2">{option.optionText}</label>
                </div>
              ))
            ) : (
              <textarea
                ref={textareaRef}
                className="border p-2 w-full resize-none overflow-hidden"
                value={responses.find(response => response.questionId === currentQuestion._id)?.answer || ''}
                onChange={(e) => handleChange(currentQuestion._id, e.target.value)}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            )}
          </div>
          <div className="flex justify-between mt-6">
            
              <button
                onClick={handlePrevious}
                className={`bg-slate-500 text-white px-4 py-2 rounded-xl ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={currentQuestionIndex === 0}
              >
               <Image
                    src="/arrow-sm-left-svgrepo-com.svg"
                    width={50}
                    height={50}
                    alt="Previous"
                  />
              </button>
            
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Submit Responses
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptQuizPage;