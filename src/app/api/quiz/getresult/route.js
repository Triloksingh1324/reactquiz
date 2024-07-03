import { NextResponse } from 'next/server';
import {connect} from '../../../../dbconfig';
import QuizCreator from '../../../../models/Quizcreator';
import Response from '../../../../models/Quizresponse';


connect();
export async function GET(req, res) {
  

  const searchParams = req.nextUrl.searchParams
  console.log(req.body);
  const quizId = searchParams.get('quizId');
    console.log(quizId);
  const userId = searchParams.get('userId');
  console.log(userId);


  try {
    const response = await Response.findOne({ quizId, userId }).populate('quizId');
    if (!response) {
      return NextResponse.json({success: false, error:'Could not find quiz'})
    }

     return NextResponse.json({success: true, response});
  } catch (error) {
    console.error(error);
    return NextResponse.json({success: false, error: 'Server Error'})
  }
}
