import QuizCreator from "../../../models/Quizcreator";
import { connect } from "../../../dbconfig";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";

connect();

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const quizId = searchParams.get('quizId');
  console.log(quizId);
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  console.log(accessToken.value);
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decodedToken = jwt.verify(accessToken.value, process.env.Access_TOKEN_SECRET);
    console.log("decoded token: " , decodedToken)   
    const response = await QuizCreator.findById(quizId);
    console.log("response",response);
    if (!response) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    const userid = response.creatorId; 
    if (userid === decodedToken.id) {
      return NextResponse.json({
        success: true,
        status: 200,
        
      });
    }

    return NextResponse.json({ message: 'No quiz created yet' }, { status: 200 });
  } catch (error) {
    console.error('Error getting quiz creator:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
