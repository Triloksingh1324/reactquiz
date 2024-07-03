import QuizCreator from '../../../../models/Quizcreator';
import user from '../../../../models/UserModel';
import {connect} from '../../../../dbconfig'
connect()
export async function GET(req){
    console.log(req.query);
    const searchParams = req.nextUrl.searchParams
    console.log(searchParams);
    const quizId = searchParams.get('quizId');
    console.log(quizId);
    try{
    const quiz = await QuizCreator.findById(quizId);
    console.log(quiz);
    if(!quiz){
        return new Response(JSON.stringify({success:false, error: 'Quiz not found'}),{status:404})
    }
    return new Response(JSON.stringify({success:true,quiz:quiz}),{status:200})
    }
    catch(error){
        return new Response(JSON.stringify({error: error.message}),{status:400})
    }
}