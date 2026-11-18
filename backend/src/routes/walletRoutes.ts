import { Router } from 'express';
import { getBalance, deposit, withdraw, getHistory } from '../controllers/walletController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.use(authenticate, requireRole('USER'));

router.get('/balance', getBalance);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.get('/history', getHistory);

export default router;
