import QuizCreator from '../../../../models/Quizcreator';
import Response from '../../../../models/Quizresponse';
import { connect } from '../../../../dbconfig';
import { NextResponse } from 'next/server';
connect();

export async function POST(req) {
  try {
    const { quizId, userId, responses } = await req.json();

    const quiz = await QuizCreator.findById(quizId);
    if (!quiz) {
      return new Response(JSON.stringify({ success: false, error: 'Quiz not found' }), { status: 404 });
    }

    let totalScore = 0;

    responses.forEach(response => {
      const question = quiz.questions.id(response.questionId);
      if (question) {
        if (question.type === 'MCQ' || question.type === 'FillUp') {
          response.isCorrect = question.correctAnswer.toLowerCase() === response.answer.toLowerCase();
          response.score = response.isCorrect ? question.score : 0;
        } else if (question.type === 'Subjective') {
          response.isCorrect = null;
          response.score = response.score <= question.score ? response.score : question.score;
        }
        totalScore += response.score;
      }
    });

    const existingResponse = await Response.findOne({ quizId, userId });
    if (!existingResponse) {
      return new Response(JSON.stringify({ success: false, error: 'Response not found' }), { status: 404 });
    }

    existingResponse.answers = responses;
    existingResponse.totalScore = quiz.grades ? totalScore : null;
    existingResponse.status = 'declared';

    await existingResponse.save();

    return new Response(JSON.stringify({ success: true, message: 'Responses checked successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error checking responses:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const quizId = searchParams.get('quizId');
    console.log("get ",quizId);
    if (!quizId) {
      return new Response(JSON.stringify({ success: false, error: 'Quiz ID is required' }), { status: 400 });
    }

    const responses = await Response.find({ quizId }).populate('userId');
          console.log("This is response : ",responses);

    return NextResponse.json({ success: true, responses }, { status: 200 });

  } catch (error) {
    console.error('Error fetching responses:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}

