import { Router } from 'express';
import { getRoutes, calculateFare, bookTicket, getTickets } from '../controllers/ticketController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.use(authenticate, requireRole('USER'));

router.get('/routes', getRoutes);
router.post('/calculate-fare', calculateFare);
router.post('/book', bookTicket);
router.get('/', getTickets);

export default router;
