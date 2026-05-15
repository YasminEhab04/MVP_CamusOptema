import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const getNotifications = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
