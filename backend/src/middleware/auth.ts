import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123', (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    req.user = user as { id: string; email: string };
    next();
  });
};
