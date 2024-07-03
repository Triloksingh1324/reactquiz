import { NextResponse } from 'next/server';
import { connect } from '../../../../../src/dbconfig';
import QuizCreator from '../../../../models/Quizcreator';
import { authenticateToken } from '../../middleware/authenticate_token';

connect();

export async function PUT(req) {
  try {
    const isAuthenticated = await authenticateToken(req);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId, questions, isPublished, removedQuestions } = await req.json();

    const quiz = await QuizCreator.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }

    if (questions) {
      quiz.questions = questions;
    }

    if (isPublished !== undefined) {
      quiz.isPublished = isPublished;
    }

    if (removedQuestions) {
      quiz.questions = quiz.questions.filter(q => !removedQuestions.includes(q._id));
    }

    await quiz.save();

    return NextResponse.json({ success: true, message: 'Quiz updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
