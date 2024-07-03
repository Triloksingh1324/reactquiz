import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  quizzesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuizCreator" }],
  quizzesTaken: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "QuizCreator" },
    score: { type: Number }
  }],
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  refreshToken: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
