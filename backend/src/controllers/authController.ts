import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body; 

    if (role === 'CONDUCTOR') {
      return res.status(403).json({ message: 'Conductor registration is not publicly allowed' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        wallet: { create: { balance: 0.0 } }
      }
    });
    return res.status(201).json({ message: 'User registered', id: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (role === 'CONDUCTOR') {
      const conductor = await prisma.conductor.findUnique({ where: { email } });
      if (!conductor) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, conductor.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: conductor.id, role: 'CONDUCTOR' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: { id: conductor.id, name: conductor.name, email: conductor.email, role: 'CONDUCTOR' } });
    } else {
      const user = await prisma.user.findUnique({ where: { email }, include: { wallet: true } });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: 'USER' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: 'USER', walletId: user.wallet?.id } });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const otpStore = new Map<string, string>();

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'This email address does not exist' });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);
    // console.log(OTP for  is ); // For dev testing
    console.log(`OTP for ${email} is ${otp}`); // For dev testing
    
    // res.json({ message: OTP sent successfully (Simulated: Check server console for ) });
    res.json({ message: `OTP sent successfully (Simulated: Check server console for ${email})` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (otpStore.get(email) === otp) {
      res.json({ message: 'OTP verified' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (otpStore.get(email) !== otp) return res.status(400).json({ message: 'Invalid or expired OTP' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    otpStore.delete(email);
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

