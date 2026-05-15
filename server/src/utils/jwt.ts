import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const signToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
