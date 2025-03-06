import { Router } from 'express';
import apiController from '../controller/apiController';
import authController from '../controller/auth.controller';
import folderController from '../controller/folder.controller';
import { authenticateUser } from '../middleware/authenticateUser';
// import rateLimit from '../middleware/rateLimit';

const router = Router();

// router.use(rateLimit); // This rate limiter will be applied for all the endpoints.
router.route('/self').get(apiController.self);
router.route('/health').get(apiController.health);

// Auth router
router.post('/auth/signup', authController.signup);
router.post('/auth/signin', authController.signin);
router.get('/auth/signout', authController.signOut);

// Folder router
router.get('/folders', authenticateUser, folderController.getFolders);
router.post('/folders', authenticateUser, folderController.createFolder);
router.put('/folders/:id', authenticateUser, folderController.updateFolder);
router.delete('/folders/:id', authenticateUser, folderController.deleteFolder);

export default router;
