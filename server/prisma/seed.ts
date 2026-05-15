import { PrismaClient, Role, ResourceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@campus.edu',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create Staff User
  const staffPassword = await bcrypt.hash('staff123', 10);
  await prisma.user.create({
    data: {
      name: 'Staff User',
      email: 'staff@campus.edu',
      password: staffPassword,
      role: Role.STAFF,
    },
  });

  // Create Student User
  const studentPassword = await bcrypt.hash('student123', 10);
  await prisma.user.create({
    data: {
      name: 'Student User',
      email: 'student@campus.edu',
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  // Create Resources
  const resources = [
    {
      name: 'Lecture Hall A',
      type: ResourceType.ROOM,
      capacity: 100,
      location: 'Building 1, Floor 2',
    },
    {
      name: 'Lab 101',
      type: ResourceType.LAB,
      capacity: 30,
      location: 'Building 2, Floor 1',
    },
    {
      name: 'Projector X',
      type: ResourceType.EQUIPMENT,
      capacity: 1,
      location: 'AV Storage',
    },
    {
      name: 'Meeting Room B',
      type: ResourceType.ROOM,
      capacity: 10,
      location: 'Main Library, Floor 3',
    },
  ];

  for (const resource of resources) {
    await prisma.resource.create({
      data: resource,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
