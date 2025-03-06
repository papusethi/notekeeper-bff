import jwt from 'jsonwebtoken';
import config from '../config/config';

export default {
  generateToken: (data: object) => {
    return jwt.sign(data, config.JWT_SECRET as string, { expiresIn: '1D' });
  }
};
