import { Router } from 'express';
import { scanTicket, manualTicket, getHistory, getProfile, updateProfile } from '../controllers/conductorController';
import { calculateFare } from '../controllers/ticketController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.use(authenticate, requireRole('CONDUCTOR'));

router.post('/scan', scanTicket);
router.post('/manual-ticket', manualTicket);
router.get('/history', getHistory);
router.post('/calculate-fare', calculateFare);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
