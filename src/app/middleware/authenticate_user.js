import jwt from 'jsonwebtoken';

export async function authenticateUser(req) {
  const token = localStorage.getItem('accessToken');
  console.log(token);
  if (!token) {
    return { authenticated: false, userId: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET);
    return { authenticated: true, userId: decoded.id };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { authenticated: false, userId: null };
  }
}
