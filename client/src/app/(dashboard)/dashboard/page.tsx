'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Resource, ResourceType } from '@/types';
import { Button } from '@/components/ui';
import { MapPin, Users, Info, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data);
      } catch (error) {
        console.error('Failed to fetch resources', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

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
        <h1 className="text-2xl font-bold text-zinc-900">Available Resources</h1>
        <Link href="/dashboard/new-resource">
           <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex flex-col rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  {resource.type}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900">{resource.name}</h3>
              </div>
              {!resource.isAvailable && (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
                  Unavailable
                </span>
              )}
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex items-center text-sm text-zinc-500">
                <MapPin className="mr-2 h-4 w-4" />
                {resource.location}
              </div>
              <div className="flex items-center text-sm text-zinc-500">
                <Users className="mr-2 h-4 w-4" />
                Capacity: {resource.capacity}
              </div>
              <div className="pt-4">
                <Link href={`/dashboard/book/${resource.id}`}>
                  <Button className="w-full" variant={resource.isAvailable ? 'primary' : 'outline'} disabled={!resource.isAvailable}>
                    {resource.isAvailable ? 'Book Now' : 'Currently Booked'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-zinc-300 py-12 text-center">
          <Info className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-2 text-sm font-semibold text-zinc-900">No resources found</h3>
          <p className="mt-1 text-sm text-zinc-500">Start by adding a new resource to the system.</p>
        </div>
      )}
    </div>
  );
}
