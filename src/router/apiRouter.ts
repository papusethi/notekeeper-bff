import { Router } from 'express';
import apiController from '../controller/apiController';
// import rateLimit from '../middleware/rateLimit';

const router = Router();

// router.use(rateLimit); // This rate limiter will be applied for all the endpoints.
router.route('/self').get(apiController.self);
router.route('/health').get(apiController.health);

export default router;
