'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { ResourceType } from '@/types';
import { Button, Input } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const resourceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.nativeEnum(ResourceType),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

export default function NewResourcePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      type: ResourceType.ROOM,
      capacity: 1,
    },
  });

  const onSubmit = async (data: ResourceFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/resources', data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create resource.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-zinc-900">Add New Resource</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create a new campus resource available for booking.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Resource Name"
              placeholder="e.g. Conference Room A"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="w-full">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Resource Type
              </label>
              <select
                {...register('type')}
                className="block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value={ResourceType.ROOM}>Room</option>
                <option value={ResourceType.LAB}>Lab</option>
                <option value={ResourceType.EQUIPMENT}>Equipment</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>

            <Input
              label="Capacity"
              type="number"
              placeholder="e.g. 10"
              error={errors.capacity?.message}
              {...register('capacity', { valueAsNumber: true })}
            />

            <Input
              label="Location"
              placeholder="e.g. Science Building, 2nd Floor"
              error={errors.location?.message}
              {...register('location')}
            />
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
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Resource
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}