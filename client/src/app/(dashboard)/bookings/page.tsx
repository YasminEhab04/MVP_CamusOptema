'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Booking, BookingStatus, Role } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { format } from 'date-fns';
import { Check, X, Clock, Calendar } from 'lucide-react';

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error('Failed to update booking status', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'text-green-700 bg-green-50 ring-green-600/20';
      case BookingStatus.REJECTED:
        return 'text-red-700 bg-red-50 ring-red-600/20';
      default:
        return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">
          {user?.role === Role.ADMIN || user?.role === Role.STAFF ? 'All Bookings' : 'My Bookings'}
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Resource
              </th>
              {(user?.role === Role.ADMIN || user?.role === Role.STAFF) && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                  User
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Time Slot
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Status
              </th>
              {(user?.role === Role.ADMIN || user?.role === Role.STAFF) && (
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-zinc-900">{booking.resource?.name}</div>
                  <div className="text-sm text-zinc-500">{booking.resource?.location}</div>
                </td>
                {(user?.role === Role.ADMIN || user?.role === Role.STAFF) && (
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                    {booking.user?.name}
                    <div className="text-xs">{booking.user?.email}</div>
                  </td>
                )}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {format(new Date(booking.startTime), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    {format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                {(user?.role === Role.ADMIN || user?.role === Role.STAFF) && (
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    {booking.status === BookingStatus.PENDING && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleUpdateStatus(booking.id, BookingStatus.APPROVED)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleUpdateStatus(booking.id, BookingStatus.REJECTED)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-zinc-500"
                >
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
