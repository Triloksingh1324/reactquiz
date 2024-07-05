import QuizCreator from '../../../../models/Quizcreator';
import Response from '../../../../models/Quizresponse';
import { connect } from '../../../../dbconfig';
import { NextResponse } from 'next/server';
connect();


export async function PUT(req) {
  try {
    const { quizId, userId, scores, status } = await req.json();
    console.log('quizId:', quizId);
    console.log('userId:', userId);
    console.log('scores:', scores);
    console.log('status:', status);

    if (typeof scores !== 'object' || scores === null) {
      return NextResponse.json({ success: false, error: 'Scores must be an object' }, { status: 400 });
    }

    // Find the quiz response by quizId and userId
    const existingResponse = await Response.findOne({ quizId, userId }).populate({
      path: 'quizId',
      populate: {
        path: 'questions',
        model: 'Question'
      }
    });
    console.log("this is response", existingResponse);

    if (!existingResponse) {
      return NextResponse.json({ success: false, error: 'Response not found' }, { status: 404 });
    }

    let totalScore = 0;

    Object.entries(scores).forEach(([questionId, score]) => {
      const question = existingResponse.quizId.questions.find(q => q._id.equals(questionId));
      if (question) {
        const answer = existingResponse.answers.find(a => a.questionId.equals(questionId));
        if (answer) {
          if (question.type === 'MCQ' || question.type === 'FillUp') {
            answer.isCorrect = question.correctAnswer.toLowerCase() === answer.answer.toLowerCase();
            answer.score = answer.isCorrect ? question.score : 0;
          } else if (question.type === 'Subjective') {
            answer.isCorrect = null;
            answer.score = score <= question.score ? score : question.score;
          }
          totalScore += answer.score;
        }
      }
    });

    existingResponse.status = status;
    existingResponse.totalScore = totalScore;

    await existingResponse.save(); // Save updated response

    return NextResponse.json({ success: true, message: 'Responses checked successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error checking responses:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const quizId = searchParams.get('quizId');
    console.log("get ",quizId);
    if (!quizId) {
      return NextResponse.json({ success: false, error: 'Quiz ID is required' },{ status: 400 });
    }

    const responses = await Response.find({ quizId }).populate('userId');
          console.log("This is response : ",responses);

    return NextResponse.json({ success: true, responses }, { status: 200 });

  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ success: false, error: error.message },{ status: 400 });
  }
}

