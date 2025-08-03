import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { connect } from "../../../dbconfig";
import QuizCreator from '../../../models/Quizcreator';
import User from '../../../models/UserModel';
connect();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: FunctionDeclarationSchemaType.ARRAY,
      items: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          question_text: {
            type: FunctionDeclarationSchemaType.STRING,
          },
        },
      },
    },
  },
});

export async function POST(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const quizId = searchParams.get('quizId');
    console.log("quizid :",quizId);
    console.log(req);
    console.log("here upper rebody");
    const reqBody = await req.json();
    console.log("reqbody :",reqBody);
    const { concept, level, userId, numQuestions } = reqBody;
    console.log(level, userId, numQuestions,concept);
    const prompt=`Create a quizon topic ${concept} which includes ${numQuestions} ${level} level subjective question.`;
    console.log("I am prompt :   ",prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("response",response);
    const text = await response.text();
    console.log("Generated questions:", text);
    const questions = await JSON.parse(text);
    console.log("Questions:", questions);
    const mappedQuestions = questions.slice(0, numQuestions).map((q) => ({
      type: 'Subjective',
      content: q.question_text.trim(),
      score: 1 
    }));

    const quiz = await QuizCreator.findById(quizId);
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }
   const title=quiz.title;
    quiz.questions.push(...mappedQuestions);

    await quiz.save();

    // await newQuiz.save();
    const userToUpdate = await User.findByIdAndUpdate(
      userId,
      { $push: { quizzesCreated: { quiz: quiz._id, title: title } } },
      { new: true }
    );
    if (!userToUpdate) {
      throw new Error('User not found');
    }
    await userToUpdate.save();

    return NextResponse.json({ success: true, quiz });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Server Error' });
  }
}


