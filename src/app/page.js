"use client"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router=useRouter();
  const onCreate= () => {
    router.push("quizSection/createQuiz");
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gradient-to-tr from-red-300 to-yellow-200 flex justify-center items-center justify-evenly py-10">
        <div className="md:px-4 md:grid md:grid-cols-2 lg:grid-cols-2 gap-20 space-y-4 md:space-y-0">
         
          <div className="max-w-sm bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-500" onClick={()=>{
            onCreate();
          }}>
            <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>
            <p className="text-gray-700 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
          </div>

          <div className="max-w-sm bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-500">
            <h2 className="text-2xl font-bold mb-4">Attempt Quiz</h2>
            <p className="text-gray-700 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
