
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connect } from '../../../../dbconfig'
import User from '../../../../models/UserModel'

connect()
export const dynamic = 'force-dynamic'
export async function POST(request) {
    try {
        const reqbody = await request.json();
        const { email, password } = reqbody;

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokenData = {
            id: user._id,
        };

        const accessToken = jwt.sign(tokenData, process.env.Access_TOKEN_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign(tokenData, process.env.Refresh_TOKEN_SECRET, { expiresIn: "7d" });

        user.refreshToken = refreshToken;

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set({
            name:"accessToken",
            value: accessToken,
            maxAge: 24 * 60 * 60*2,
        });
        response.cookies.set('refreshToken', refreshToken, { path: '/', maxAge: 7 * 24 * 60 * 60 });
        
        await user.save();
        return response;

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
