import QuizResponse from '../../../../models/Quizresponse';
import User from '../../../../models/UserModel';
import { connect } from '../../../../dbconfig';
connect();

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const quizId = searchParams.get('quizId');
    const userId = searchParams.get('userId');

    if (!quizId || !userId) {
      return new Response(JSON.stringify({ success: false, error: 'Quiz ID and User ID are required' }), { status: 400 });
    }

    const response = await QuizResponse.findOne({ quizId, userId }).populate('userId');
    console.log(response);
    if (!response) {
      return new Response(JSON.stringify({ success: false, error: 'Response not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, response }), { status: 200 });
  } catch (error) {
    console.error('Error fetching user response:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}
