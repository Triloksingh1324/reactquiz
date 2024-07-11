import Response from "../../../models/Quizresponse";
import { NextResponse } from "next/server";
export  async function GET(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const quizId = searchParams.get('quizId');
    console.log(quizId);
  try {
    const leaderboard = await Response
      .find({ quizId })
      .populate("userId", "userName")
    
      .sort({ totalScore: -1 }) 
      .exec();
     console.log("leaderboard : ",leaderboard);
    return NextResponse.json({success: true, leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ success: false, error: "Error fetching leaderboard" });
  }
}
