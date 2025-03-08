import bcryptjs from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import responseMessage from '../constant/responseMessage';
import User from '../model/user.model';
import { IUser } from '../types/types';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';
import jwtToken from '../utils/jwtToken';

/**
 * Handles user registration.
 *
 * @param {Request} req - Express request object containing username, email, and password.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for error handling.
 * @returns {Promise<void>} Sends response with success message and JWT token.
 */
const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body as { username: string; email: string; password: string };

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return httpError(next, new Error(responseMessage.USER_ALREADY_EXISTS), req, 400);
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user
    const newUser: IUser = await User.create({ username, email, password: hashedPassword });

    const userData = { id: newUser._id, username: newUser.username, email: newUser.email };

    // Generate JWT token
    const token = jwtToken.generateToken(userData);

    // Send success response with token
    httpResponse(req, res, 201, responseMessage.SUCCESS, { token, user: userData });
  } catch (err) {
    // Handle duplicate key error (MongoDB error code 11000)
    if ((err as { code: number })?.code === 11000) {
      return httpError(next, new Error(responseMessage.EMAIL_ALREADY_EXISTS), req, 400);
    }
    httpError(next, err, req, 500);
  }
};

/**
 * Handles user authentication (sign-in).
 *
 * @param {Request} req - Express request object containing email and password.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for error handling.
 * @returns {Promise<void>} Sends response with JWT token upon successful authentication.
 */
const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    // Find the user by email, retrieving only necessary fields
    const foundUser = await User.findOne({ email }).select('_id username email password');

    if (!foundUser) {
      return httpError(next, new Error(responseMessage.INVALID_USER), req, 404);
    }

    // Compare provided password with the stored hashed password
    const isPasswordValid = await bcryptjs.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return httpError(next, new Error(responseMessage.INVALID_CREDENTIALS), req, 401);
    }

    // Extract user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...restUser } = foundUser.toObject();

    const userData = { id: restUser._id, username: restUser.username, email: restUser.email };

    // Generate JWT token
    const token = jwtToken.generateToken(userData);

    // Send success response with token and user data
    httpResponse(req, res, 200, responseMessage.SIGNIN_SUCCESS, { token, user: userData });
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Handles user sign-out by clearing the authentication token.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for error handling.
 * @returns {Promise<void>} Sends success response after signing out.
 */
const signOut = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Clear the JWT token from cookies (if stored in an HTTP-only cookie)
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure secure in production
      sameSite: 'strict'
    });

    // Send success response
    httpResponse(req, res, 200, responseMessage.SIGNOUT_SUCCESS);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

export default { signup, signin, signOut };
