import React from 'react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';



const Navbar = () => {
  const router = useRouter();
  const onLogout=()=>{
  
    deleteCookie('accessToken',{ path: '/', domain: process.env.NEXT_PUBLIC_ACCESS_DOMAIN });
    deleteCookie('refreshToken',{ path: '/', domain: process.env.NEXT_PUBLIC_ACCESS_DOMAIN });
    router.push('/');
  }
  return (
    <header className="text-gray-600 body-font mb-16">
      <div className="container mx-auto flex flex-wrap  p-5 min-w-full flex-col md:fixed sm:relative md:flex-row items-center bg-white top-0">
        <a className="flex title-font font-medium items-center text-gray-900 md:ml-24 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">QuizApp</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base md:mr-16 justify-center">
          <a className="mr-5 hover:text-gray-900" href="/">Home</a>
          <a className="mr-5 hover:text-gray-900" href="/">Created</a>
          <a className="mr-5 hover:text-gray-900" href="/attempted">Attempted</a>
        </nav>
        <button className="inline-flex items-center bg-blue-500 border-0 py-1 px-3 md:mr-16 focus:outline-none hover:bg-blue-600 rounded text-white text-base mt-4 md:mt-0" onClick={onLogout}>
          Logout
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
        
      </div>
    </header>
  );
};

export default Navbar;
