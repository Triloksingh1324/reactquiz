import User from '../../../../models/UserModel'
import {connect} from '../../../../dbconfig';
import { NextResponse } from 'next/server';
connect();
export async function GET(req){
    try{
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const user = await User.findById(userId);
    console.log(user);
    return NextResponse.json(user);
    }

    catch(error){
        console.error(error);
        return NextResponse.json({message: 'Error fetching user', error: error.message}, {status: 500});
    }
 
}