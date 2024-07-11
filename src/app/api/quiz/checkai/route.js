import { NextResponse } from 'next/server';
import User from '../../../../models/UserModel';
import Response from '../../../../models/Quizresponse';
import QuizCreator from '../../../../models/Quizcreator';
import { checkAnswersWithAI } from '../../Aicheck';

export async function POST(req) {
  try {
    const { quizId, userId, responses } = await req.json();
    console.log("userId : ", userId)
    const quiz = await QuizCreator.findById(quizId);
    console.log("quiz", quiz);
    let status = "pending";
    if (!quiz) {
      console.error('Quiz not found:', quizId);
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }
    console.log('Quiz found:', quiz);
    const title = quiz.title;
    console.log("title", title);
    console.log("responses", responses);

    const evaluatedAnswers = await checkAnswersWithAI(responses, quiz.questions);
    console.log("evaluatedAnswers", evaluatedAnswers);

    const totalScore = evaluatedAnswers.reduce((acc, ans) => acc + ans.score, 0);
    status = 'declared';

    const newResponse = new Response({
      quizId,
      userId,
      answers: evaluatedAnswers,
      totalScore: quiz.grades ? totalScore : null,
      status,
    });
    await newResponse.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { quizzesTaken: { quiz: quizId, score: totalScore, status: status, title: title } } }
    );

    console.log('Response saved successfully:', newResponse);
    return NextResponse.json({ success: true, message: 'Response submitted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Server Error' });
  }
}
