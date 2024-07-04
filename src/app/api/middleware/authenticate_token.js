import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import User from '../../../models/UserModel';

export const authenticateToken = async (req) => {
  try {
    const cookieStore = cookies()
  
    console.log("Using cookieStore",cookieStore.get('accessToken'));

    const token = cookieStore.get('accessToken');
    const refreshToken = cookieStore.get('refreshToken')
     console.log("token",token);
    if (!token) {
      return { success: false, error: 'Unauthorized' };
    }

    return jwt.verify(token.value, process.env.Access_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          if (!refreshToken) {
            return { success: false, error: 'Unauthorized' };
          }

          try {
            const user = await User.findOne({ refreshToken:refreshToken.value });
            if (!user) {
              return { success: false, error: 'Unauthorized' };
            }

            return jwt.verify(refreshToken.value, process.env.Refresh_TOKEN_SECRET, (err) => {
              if (err) {
                return { success: false, error: 'Unauthorized' };
              }

              const newAccessToken = jwt.sign(
                { id: user._id, username: user.username, email: user.email },
                process.env.Access_TOKEN_SECRET,
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

              req.user = user;
              return { success: true, user };
            });
          } catch (error) {
            console.error(error.message);
            return { success: false, error: 'Server Error' };
          }
        } else {
          return { success: false, error: 'Unauthorized' };
        }
      } else {
        try {
          const user = await User.findOne({ _id: decoded.id });
          if (!user) return { success: false, error: 'User not found' };

          req.user = user;
          return { success: true, user };
        } catch (error) {
          console.error(error.message);
          return { success: false, error: 'Server Error' };
        }
      }
    });
  } catch (error) {
    console.error(error.message);
    return { success: false, error: 'Server Error' };
  }
};
