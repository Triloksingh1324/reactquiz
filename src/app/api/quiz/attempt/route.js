import QuizCreator from '../../../../models/Quizcreator';
import User from '../../../../models/UserModel';
import QuizResponse from '../../../../models/Quizresponse';
import { connect } from '../../../../dbconfig';
connect();

export async function POST(req) {
  try {
    const { quizId, userId, responses } = await req.json();
    console.log("Received quizId:", quizId);
    console.log("Received userId:", userId);
    console.log("Received responses:", responses);

    const quiz = await QuizCreator.findById(quizId);
    if (!quiz) {
      console.error('Quiz not found:', quizId);
      return new Response(JSON.stringify({ success: false, error: 'Quiz not found' }), { status: 404 });
    }

    let totalScore = 0;
    let status = 'pending';

    if (quiz.checkingType === 'automatic') {
      responses.forEach(response => {
        const question = quiz.questions.id(response.questionId);
        if (question) {
          if (question.type === 'MCQ' || question.type === 'FillUp') {
            response.isCorrect = question.correctAnswer.toLowerCase() === response.answer.toLowerCase();
          } else {
            response.isCorrect = null;
          }

          response.score = response.isCorrect ? question.score : 0;
          totalScore += response.score;
        }
      });

      status = 'declared';
    }

    const newResponse = new QuizResponse({
      quizId,
      userId,
      answers: responses,
      totalScore: quiz.grades ? totalScore : null,
      status,
    });

    await newResponse.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { quizzesTaken: { quiz: quizId, score: totalScore } } }
    );

    console.log('Response saved successfully:', newResponse);
    return new Response(JSON.stringify({ success: true, message: 'Response submitted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error saving responses:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const quizId = searchParams.get('quizId');
  const userId = searchParams.get('userId');

  try {
    const response = await QuizResponse.findOne({ quizId, userId });
    
    if (response) {
      return new Response(JSON.stringify({ success: true, response }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Response not found' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}