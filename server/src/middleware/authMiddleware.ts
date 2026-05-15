import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as { id: string; role: Role };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};
