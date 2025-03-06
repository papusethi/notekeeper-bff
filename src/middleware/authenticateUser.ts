import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';

// Extend Express Request interface to include user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string };
  }
}

interface DecodedToken {
  id: string;
}

/**
 * Middleware to authenticate user via Bearer token.
 * Verifies the JWT and attaches the decoded user ID to req.user.
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    httpResponse(req, res, 401, 'Unauthorized: No token provided');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET as string) as DecodedToken;
    req.user = { id: decoded.id }; // Attach user ID to request object
    next();
  } catch (error) {
    httpError(next, error, req, 401);
  }
};
