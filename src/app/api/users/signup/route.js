import {connect} from '../../../../dbconfig';
import User from '../../../../models/UserModel';
import { NextRequest,NextResponse } from 'next/server';
import bcryptjs from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer";
connect();
export async function POST(request){
    try {
        const reqbody=await request.json();
        const {userName,email,password}=reqbody;
        console.log(reqbody);
        const user=await User.findOne({email});
        if(user){
            return NextResponse.json({error:"User already exists"},{status:400});
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const newUser=new User({
            userName,
            email,
            password:hashedPassword,
        });
        const savedUser=await newUser.save();
        console.log(savedUser);
        // await sendEmail({email,emailType:"VERIFY",userId:savedUser._id});
        return NextResponse.json({
            message:"User created successfully",
            success:true,
            savedUser
        })

        
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:error.message},{status:500});
    }
}
