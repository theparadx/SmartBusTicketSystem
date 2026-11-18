import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../utils/prisma';

export const getBalance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    
    res.json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deposit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amount } = req.body;
    
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { increment: amount } }
      });
      
      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount
        }
      });
      
      return { wallet, transaction };
    });

    res.json({ message: 'Deposit successful', balance: result.wallet.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const withdraw = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amount } = req.body;
    
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } }
      });
      
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAW',
          amount
        }
      });
      
      return updatedWallet;
    });

    res.json({ message: 'Withdrawal successful', balance: result.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
