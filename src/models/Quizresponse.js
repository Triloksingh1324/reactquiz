import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuizCreator",
    required: true,
  },
  status:{
    type: String,
    required: true,
    default: 'pending'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      answer: { type: String, required: true },
      isCorrect: { type: Boolean, default: null },
      correctAnswer: { type: String},
      timeTaken: { type: String},
      score: { type: Number, default: 0 },
      suggestion: {
        type: String,
      }
    },
  ],
  totalScore: { type: Number, default: 0 },
});

const Response = mongoose.models.QuizResponse || mongoose.model("QuizResponse", ResponseSchema);
export default Response;
