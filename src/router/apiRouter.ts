import { Router } from 'express';
import apiController from '../controller/apiController';
import authController from '../controller/auth.controller';
// import rateLimit from '../middleware/rateLimit';

const router = Router();

// router.use(rateLimit); // This rate limiter will be applied for all the endpoints.
router.route('/self').get(apiController.self);
router.route('/health').get(apiController.health);

// Auth router
router.post('/auth/signup', authController.signup);
router.post('/auth/signin', authController.signin);
router.get('/auth/signout', authController.signOut);

export default router;
