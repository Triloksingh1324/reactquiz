import { connect } from '../../../../dbconfig';
import QuizCreator from '../../../../models/Quizcreator';
import { authenticateToken } from '../../middleware/authenticate_token';
import User from '../../../../models/UserModel';
import cookie from 'cookie';

connect();

export async function POST(req, res) {
  try {
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated.success) {
      return new Response(
        JSON.stringify({ success: false, error: isAuthenticated.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { user } = isAuthenticated;
    const { title, checkingType, gradingEnabled, isTimed, startTime, endTime } = await req.json();

    const newQuiz = new QuizCreator({
      title,
      checkingType,
      grades: gradingEnabled,
      isTimed,
      startTime,
      endTime,
      creatorId: user._id,
      questions: []
    });

    await newQuiz.save();
    const userToUpdate = await User.findByIdAndUpdate(
      user._id,
      { $push: { quizzesCreated: {quiz: newQuiz._id ,title: title}}},
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
      }
    );
  }
}
