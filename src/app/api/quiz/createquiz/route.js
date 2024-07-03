import { connect } from '../../../../dbconfig';
import QuizCreator from '../../../../models/Quizcreator';
import { authenticateToken } from '../../middleware/authenticate_token';
import User from '../../../../models/UserModel';
import jwt from 'jsonwebtoken';

connect();

export async function POST(req, res) {
  try {
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = req.headers.cookie.split('accessToken=')[1].split(';')[0];
    const decoded = jwt.verify(token, process.env.Access_TOKEN_SECRET);
    const { title, checkingType, gradingEnabled, isTimed, timeframe } = await req.json();



    const newQuiz = new QuizCreator({
      title,
      checkingType,
      grades: gradingEnabled,
      isTimed,
      timeframe,
      creatorId: decoded.id,
      questions: []
    });

    await newQuiz.save();
    const userToUpdate = await User.findByIdAndUpdate(
      decoded.id,
      { $push: { quizzesCreated: newQuiz._id } },
      { new: true }
    );
    if (!userToUpdate) {
      throw new Error('User not found');
    }
    await userToUpdate.save();

    console.log('User updated:', userToUpdate);
    return new Response(
      JSON.stringify({ success: true, quizId: newQuiz._id }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error creating quiz:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
