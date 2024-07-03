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
    if (quiz.checkingType === 'automatic') {
      responses.forEach(response => {
        const question = quiz.questions.id(response.questionId);
        if (question) {
          if (question.type === 'MCQ' || question.type === 'FillUp') {
            response.isCorrect = question.correctAnswer === response.answer;
          } else {
            response.isCorrect = null; 
          }

          response.score = response.isCorrect ? question.score : 0;
          totalScore += response.score;
        }
      });
    }

    const newResponse = new QuizResponse({
      quizId,
      userId,
      answers: responses,
      totalScore: quiz.grades ? totalScore : null,
    });

    await newResponse.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { quizzesTaken: { quiz: quizId, score: totalScore } } }
    );

    console.log('Response saved successfully:', newResponse);
    return new Response(JSON.stringify({ success: true, message: 'Responses submitted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error saving responses:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
