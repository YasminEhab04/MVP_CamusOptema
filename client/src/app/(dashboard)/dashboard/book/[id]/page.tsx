'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Resource } from '@/types';
import { Button, Input } from '@/components/ui';
import { ChevronLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { format, addHours, startOfHour } from 'date-fns';

const bookingSchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookResourcePage() {
  const router = useRouter();
  const { id } = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      startTime: format(startOfHour(addHours(new Date(), 1)), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(startOfHour(addHours(new Date(), 2)), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await api.get(`/resources`);
        const found = response.data.find((r: Resource) => r.id === id);
        if (found) {
          setResource(found);
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        setError('Failed to fetch resource details');
      } finally {
        setIsFetching(false);
      }
    };

    fetchResource();
  }, [id]);

  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/bookings', {
        resourceId: id,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      router.push('/bookings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!resource && error) {
    return (
      <div className="mx-auto max-w-2xl text-center py-12">
        <h2 className="text-xl font-semibold text-zinc-900">{error}</h2>
        <Link href="/dashboard" className="mt-4 text-indigo-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Book {resource?.name}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {resource?.type} • {resource?.location} • Capacity: {resource?.capacity}
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Start Time"
              type="datetime-local"
              error={errors.startTime?.message}
              {...register('startTime')}
            />
            <Input
              label="End Time"
              type="datetime-local"
              error={errors.endTime?.message}
              {...register('endTime')}
            />
          </div>

          <div className="rounded-md bg-indigo-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">Booking Policy</h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <p>
                    All bookings are subject to approval by the staff. You will be notified once
                    your request is processed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={!resource?.isAvailable}>
              Request Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
