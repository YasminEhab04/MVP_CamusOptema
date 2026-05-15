import { Response } from 'express';
import { PrismaClient, BookingStatus, Role } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { resourceId, startTime, endTime } = req.body;
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    return res.status(400).json({ message: 'End time must be after start time' });
  }

  try {
    // Check for overlapping bookings (not rejected)
    const overlapping = await prisma.booking.findFirst({
      where: {
        resourceId,
        status: { not: BookingStatus.REJECTED },
        OR: [
          {
            AND: [
              { startTime: { lt: end } },
              { endTime: { gt: start } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({ message: 'Resource is already booked for this time slot' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        resourceId,
        startTime: start,
        endTime: end,
        status: BookingStatus.PENDING,
      },
      include: { resource: true },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        message: `Your booking for ${booking.resource.name} is pending approval.`,
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let bookings;
    if (req.user.role === Role.ADMIN || req.user.role === Role.STAFF) {
      bookings = await prisma.booking.findMany({
        include: { user: true, resource: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      bookings = await prisma.booking.findMany({
        where: { userId: req.user.id },
        include: { resource: true },
        orderBy: { createdAt: 'desc' },
      });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // APPROVED or REJECTED

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { resource: true },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        message: `Your booking for ${booking.resource.name} has been ${status.toLowerCase()}.`,
      },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
