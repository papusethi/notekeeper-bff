import { Connection } from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';

const DURATION = 60;
const POINTS = 10;

export let rateLimiterMongo: null | RateLimiterMongo = null;

export const initRateLimiter = (mongooseConnection: Connection) => {
  rateLimiterMongo = new RateLimiterMongo({
    storeClient: mongooseConnection,
    duration: DURATION,
    points: POINTS
  });
};
