import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../utils/prisma';
import crypto from 'crypto';
import { stations, calculateFareAmount } from '../utils/fareCalculator';

export const getRoutes = async (req: AuthRequest, res: Response) => {
  try {
    res.json(stations.map(s => s.name));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const calculateFare = async (req: AuthRequest, res: Response) => {
  try {
    const { source, destination, busType, adults = 1, children = 0 } = req.body;
    
    const fare = calculateFareAmount(source, destination, busType, adults, children);
    
    res.json({ fare });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

export const bookTicket = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { source, destination, busType, fare } = req.body;

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < fare) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const qrToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 3); // 3 hours validity

    const result = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: fare } }
      });
      
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'TICKET_PAYMENT',
          amount: fare
        }
      });
      
      const ticket = await tx.ticket.create({
        data: {
          userId,
          source,
          destination,
          busType,
          fare,
          status: 'ACTIVE',
          qrToken,
          expiresAt
        }
      });
      
      return ticket;
    });

    res.status(201).json({ message: 'Ticket booked successfully', ticket: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Expire any ACTIVE or IN_USE tickets that have passed their expiration time (3 hours)
    await prisma.ticket.updateMany({
      where: {
        userId,
        status: { in: ['ACTIVE', 'IN_USE'] },
        expiresAt: { lt: new Date() }
      },
      data: {
        status: 'INACTIVE'
      }
    });

    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
