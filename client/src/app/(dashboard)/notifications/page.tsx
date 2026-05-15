'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Notification } from '@/types';
import { format } from 'date-fns';
import { Bell, CheckCircle, Info } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start rounded-lg border p-4 shadow-sm transition-colors ${
              notification.read ? 'border-zinc-200 bg-white' : 'border-indigo-100 bg-indigo-50/50'
            }`}
          >
            <div className="mr-4 flex-shrink-0">
              <div className={`rounded-full p-2 ${notification.read ? 'bg-zinc-100 text-zinc-500' : 'bg-indigo-100 text-indigo-600'}`}>
                <Bell className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm ${notification.read ? 'text-zinc-600' : 'text-zinc-900 font-medium'}`}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 py-12 text-center">
            <Info className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-2 text-sm font-semibold text-zinc-900">No notifications</h3>
            <p className="mt-1 text-sm text-zinc-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
