'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../helpers/axiosInstance';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserPage = ({ params }) => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [showCreatedQuizzes, setShowCreatedQuizzes] = useState(false);
  const [showTakenQuizzes, setShowTakenQuizzes] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`/api/users/userdetail?userId=${params.users}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetail();
  }, [params]);

  const handleQuizClick = (quizId, type) => {
    if (type === 'created') {
      router.push(`/seeattempt/${quizId}`);
    } else if (type === 'taken') {
      router.push(`/getresult/${quizId}`);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Page: {params.users}</h1>
      {userDetails && (
        <>
          <div className="mb-4">
            <h2 
              className="text-xl font-bold mb-2 cursor-pointer" 
              onClick={() => setShowCreatedQuizzes(!showCreatedQuizzes)}
            >
              Quizzes Created
            </h2>
            {showCreatedQuizzes && (
              <div className="ml-4">
                {userDetails.quizzesCreated.map((quiz) => (
                  <div 
                    key={quiz._id} 
                    className="p-2 border border-gray-300 rounded-md mb-2 cursor-pointer"
                    onClick={() => handleQuizClick(quiz._id, 'created')}
                  >
                    {quiz.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <h2 
              className="text-xl font-bold mb-2 cursor-pointer" 
              onClick={() => setShowTakenQuizzes(!showTakenQuizzes)}
            >
              Quizzes Taken
            </h2>
            {showTakenQuizzes && (
              <div className="ml-4">
                {userDetails.quizzesTaken.map((quiz) => (
                  <div 
                    key={quiz._id} 
                    className="p-2 border border-gray-300 rounded-md mb-2 cursor-pointer"
                    onClick={() => handleQuizClick(quiz._id, 'taken')}
                  >
                    {quiz.title} - Status: {quiz.status} - Score: {quiz.score ?? 'Pending'}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
    <Footer className="bg-white"/>
    </>
  );
};

export default UserPage;
