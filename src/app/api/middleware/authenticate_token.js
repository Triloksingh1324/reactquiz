import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '../../../models/UserModel';

export const authenticateToken = async (req) => {
  try {
    const cookies = req.cookies;
    const token = cookies.accessToken;
    const refreshToken = cookies.refreshToken;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          if (!refreshToken) {
            return NextResponse.json({ success: false, error: "Error" }, { status: 403 });
          }

          try {
            const user = await User.findOne({ refreshToken });
            if (!user) {
              return NextResponse.json({ success: false, error: 'Error' }, { status: 403 });
            }

            return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
              if (err) {
                return NextResponse.json({ success: false, error: 'Error' }, { status: 403 });
              }

              const newAccessToken = jwt.sign(
                { id: user._id, username: user.username, email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
              );

              const response = NextResponse.next();
              response.cookies.set('accessToken', newAccessToken, {
                httpOnly: true,
                maxAge: 15 * 60,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
              });

              request.user = user;
              return response;
            });
          } catch (error) {
            console.error(error.message);
            return NextResponse.json({ success: false, error: 'Error' }, { status: 500 });
          }
        } else {
          return NextResponse.json({ success: false, error: 'Error' }, { status: 403 });
        }
      } else {
        try {
          const user = await User.findOne({ _id: decoded.id });
          if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

          request.user = user;
          return NextResponse.next();
        } catch (error) {
          console.error(error.message);
          return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
        }
      }
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
};
