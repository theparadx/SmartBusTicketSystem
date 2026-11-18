import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.use(authenticate, requireRole('USER'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
