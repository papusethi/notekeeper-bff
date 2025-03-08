import { NextFunction, Request, Response } from 'express';
import responseMessage from '../constant/responseMessage';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';
import quicker from '../utils/quicker';

/**
 * Responds with a success message to confirm API availability.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
const self = (req: Request, res: Response, next: NextFunction): void => {
  try {
    httpResponse(req, res, 200, responseMessage.SUCCESS);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Provides system and application health status.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
const health = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const healthData = {
      application: quicker.getApplicationHealth(),
      system: quicker.getSystemHealth(),
      timestamp: Date.now()
    };

    httpResponse(req, res, 200, responseMessage.SUCCESS, healthData);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

export default { self, health };
