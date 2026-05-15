export enum Role {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum ResourceType {
  ROOM = 'ROOM',
  LAB = 'LAB',
  EQUIPMENT = 'EQUIPMENT',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  resource?: Resource;
  user?: User;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}
