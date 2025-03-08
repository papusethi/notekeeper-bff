import bcryptjs from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import responseMessage from '../constant/responseMessage';
import User from '../model/user.model';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';

/**
 * Updates the authenticated user's information (username and/or password).
 * @param req - Express request object containing user details.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return httpError(next, new Error('User ID is missing'), req, 400);
    }

    const { username, password } = req.body as { username: string; password?: string };
    let hashedPassword = '';

    if (password?.trim()) {
      hashedPassword = bcryptjs.hashSync(password, 10);
    }

    const updatedData: Partial<{ username: string; password: string }> = { username };
    if (hashedPassword) {
      updatedData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true });
    if (!user) {
      return httpError(next, new Error('User not found'), req, 404);
    }

    // Extract user data without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...restUser } = user.toObject();
    const userData = {
      id: restUser._id,
      username: restUser.username,
      email: restUser.email
    };

    httpResponse(req, res, 200, responseMessage.SUCCESS, userData);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Deletes the authenticated user's account and clears authentication cookies.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return httpError(next, new Error('User ID is missing'), req, 400);
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie('access_token');
    httpResponse(req, res, 200, 'User has been deleted!');
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

export default { updateUser, deleteUser };
