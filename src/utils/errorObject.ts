import { Request } from 'express';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';
import responseMessage from '../constant/responseMessage';
import { THttpError } from '../types/types';
import logger from './logger';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): THttpError => {
  const errorObj: THttpError = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl
    },
    message: err instanceof Error ? err.message || responseMessage.SERVER_ERROR : responseMessage.SERVER_ERROR,
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null
  };

  // Log
  logger.error('CONTROLLER_ERROR', { meta: errorObj });

  // Production Env check
  if (config.ENV === EApplicationEnvironment.PRODUCTION) {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return errorObj;
};
