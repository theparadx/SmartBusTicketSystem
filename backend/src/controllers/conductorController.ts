import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../utils/prisma';

export const scanTicket = async (req: AuthRequest, res: Response) => {
  try {
    const conductorId = req.user!.id;
    const { qrToken } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: { qrToken }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Invalid Ticket' });
    }

    if (ticket.status === 'IN_USE') {
      return res.status(400).json({ message: 'Ticket Already In Use' });
    }

    if (ticket.status === 'EXPIRED' || ticket.status === 'INACTIVE') {
      return res.status(400).json({ message: 'Ticket Expired - Cannot Be Validated' });
    }

    // Check expiration time (3 hours validity)
    if (ticket.expiresAt && new Date() > ticket.expiresAt) {
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: 'INACTIVE' }
      });
      return res.status(400).json({ message: 'Ticket Expired - Cannot Be Validated' });
    }

    if (ticket.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Invalid Ticket' });
    }

    // Valid Ticket
    const result = await prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.ticket.update({
        where: { id: ticket.id },
        data: { status: 'IN_USE' }
      });

      await tx.ticketValidation.create({
        data: {
          ticketId: ticket.id,
          conductorId
        }
      });

      return updatedTicket;
    });

    res.json({ message: 'Ticket Valid — IN USE', ticket: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const manualTicket = async (req: AuthRequest, res: Response) => {
  try {
    const conductorId = req.user!.id;
    const { source, destination, adults, children, busType, fare } = req.body;

    const ticket = await prisma.ticket.create({
      data: {
        source,
        destination,
        busType,
        fare,
        status: 'IN_USE',
        validations: {
          create: {
            conductorId
          }
        }
      }
    });

    res.status(201).json({ message: 'Traditional Ticket Generated', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const conductorId = req.user!.id;
    const validations = await prisma.ticketValidation.findMany({
      where: { conductorId },
      include: { ticket: true },
      orderBy: { scannedAt: 'desc' }
    });

    res.json({ validations });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const conductorId = req.user!.id;
    const conductor = await prisma.conductor.findUnique({
      where: { id: conductorId },
      select: { id: true, name: true, email: true, mobile: true, gender: true }
    });
    if (!conductor) return res.status(404).json({ message: 'Conductor not found' });
    res.json(conductor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const conductorId = req.user!.id;
    const { name, mobile, gender } = req.body;
    
    const updated = await prisma.conductor.update({
      where: { id: conductorId },
      data: { name, mobile, gender },
      select: { id: true, name: true, email: true, mobile: true, gender: true }
    });
    
    res.json({ message: 'Profile updated', conductor: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

