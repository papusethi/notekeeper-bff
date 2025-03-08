import jwt from 'jsonwebtoken';
import config from '../config/config';

export default {
  generateToken: (userData: Record<string, unknown>) => {
    const data = { id: userData?.id, email: userData?.email } as { id: string; email: string };
    return jwt.sign(data, config.JWT_SECRET as string, { expiresIn: '1D' });
  }
};
