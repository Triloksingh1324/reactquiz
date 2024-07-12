"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const Aiprompt=({ params })=> {
  const router = useRouter();
  const [concept, setConcept] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [level, setLevel] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken) {
        console.log(decodedToken.id);
        setUserId(decodedToken.id);
      } else {
        console.error('Invalid token.');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleConceptChange = (e) => {
    setConcept(e.target.value);
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(e.target.value);
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);



    try {
      const response = await axios.post(`/api/Ai?quizId=${params.slug}`, {concept,level,numQuestions,userId});

      const result = response.data;
      setQuestions(result.questions);
      setLoading(false);

      router.push(`/quizSection/Quizzes/${params.slug}`);
    } catch (error) {
      console.error('Error generating questions:', error);
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto md:mt-20 p-4 bg-gradient-to-r from-violet-200 to-pink-200 min-h-screen min-w-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Generate Quiz Questions</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Concept Name</label>
          <input
            type="text"
            value={concept}
            onChange={handleConceptChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Questions</label>
          <input
            type="number"
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Level of Questions</label>
          <select
            value={level}
            onChange={handleLevelChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm w-full"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>
      
    </div>
    <Footer/>
    </>
  );
}
export default Aiprompt
