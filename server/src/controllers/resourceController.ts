import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createResource = async (req: Request, res: Response) => {
  const { name, type, capacity, location } = req.body;

  try {
    const resource = await prisma.resource.create({
      data: { name, type, capacity, location },
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, capacity, location, isAvailable } = req.body;

  try {
    const resource = await prisma.resource.update({
      where: { id },
      data: { name, type, capacity, location, isAvailable },
    });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.resource.delete({ where: { id } });
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
