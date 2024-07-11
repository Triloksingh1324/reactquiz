import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from "@google/generative-ai";
import QuizCreator from "../../models/Quizcreator";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        score: {
          type: FunctionDeclarationSchemaType.NUMBER,
        },
        isCorrect: {
          type: FunctionDeclarationSchemaType.BOOLEAN,
        },
        suggestion: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
    },
  },
});
export async function checkAnswersWithAI(answers,questions) {
  console.log("This is answer : ",answers);
  console.log(answers.length);
  const evaluatedAnswers = [];

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const question = questions.find((q) => q._id.toString() === answer.questionId);

    const prompt = `
      Question: ${question.content}
      Answer: ${answer.answer}
      Maximum Score: ${question.score}

      Evaluate the answer and provide the following details:
      - Score
      - Is Correct
      - Suggestion (if any)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const aiFeedback = await JSON.parse(text);
    console.log("i am eeror :",answer.answer);
    evaluatedAnswers.push({
      
      questionId: answer.questionId,
      answer: answer.answer,
      isCorrect: aiFeedback.isCorrect,
      score: aiFeedback.score,
      suggestion: aiFeedback.suggestion,
    });
  }
  console.log("evaluation finished",evaluatedAnswers)
  return evaluatedAnswers;
}
