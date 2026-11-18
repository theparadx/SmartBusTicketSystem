import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';
import ticketRoutes from './routes/ticketRoutes';
import conductorRoutes from './routes/conductorRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/conductor', conductorRoutes);

import { stations } from './utils/fareCalculator';
app.get('/api/routes', (req, res) => {
  res.json(stations.map(s => s.name));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
