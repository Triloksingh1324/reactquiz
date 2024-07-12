import React ,{useState,useEffect}from 'react';
import { deleteCookie,getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';


const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
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
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const onLogout=()=>{
    
  
    deleteCookie('accessToken',{ path: '/', domain: process.env.NEXT_PUBLIC_ACCESS_DOMAIN });
    deleteCookie('refreshToken',{ path: '/', domain: process.env.NEXT_PUBLIC_ACCESS_DOMAIN });
    router.push('/');
  }
  const navigateToHome = () => {
    router.push('/');
  };
  return (
    <header className="text-gray-600 body-font mb-1">
    <div className="container mx-auto flex flex-wrap p-5 min-w-full flex-col md:fixed sm:relative md:flex-row justify-between items-start bg-white top-0">
      <a 
        className="flex title-font font-medium items-center text-gray-900 md:ml-24 mb-4 md:mb-0 cursor-pointer" 
        onClick={navigateToHome}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span className="ml-3 text-xl">QuizApp</span>
      </a>
      <button className="md:hidden  mt-[-3rem]  bg-blue-500 border-0 py-1 px-3 ml-auto focus:outline-none hover:bg-blue-600 rounded text-white text-base  md:mt-0" onClick={onLogout}>
        Logout
        
      </button>
      <button className="md:hidden inline-flex items-center ml-auto mt-2" onClick={toggleMenu}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <nav className={`md:ml-auto flex flex-wrap items-center  text-base md:mr-16 justify-center ${isOpen ? 'block' : 'hidden'} md:block`}>
        <a className="mr-5 hover:text-gray-900" href="/">Home</a>
        <a className="mr-5 hover:text-gray-900" href={`/${userId}`}>User</a>

      </nav>
     
      <button className="hidden md:inline-flex items-center bg-blue-500 border-0 py-1 px-3 md:mr-16 focus:outline-none hover:bg-blue-600 rounded text-white text-base mt-0 md:mt-0" onClick={onLogout}>
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
