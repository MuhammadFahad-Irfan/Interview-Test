import { Router } from 'express';
import { register, login, getProfile, updateProfile, getUserProfile } from '../controllers/userController';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getProfile);
router.patch('/me', auth, updateProfile);
router.get('/:userId', getUserProfile); 

export default router; 