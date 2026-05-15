'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Button, Input } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', data);
      setEmail(data.email);
      setStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', {
        email,
        code: data.code,
        newPassword: data.newPassword,
      });
      setSuccess('Password reset successfully! You can now log in.');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900">
            {step === 0 ? 'Forgot password?' : step === 1 ? 'Reset your password' : 'Password reset'}
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600">
            {step === 0
              ? "Enter your email and we'll send you a code to reset your password."
              : step === 1
              ? `We've sent a 6-digit code to ${email}`
              : "Your password has been successfully updated."}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {step === 0 && (
          <form className="mt-8 space-y-6" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              error={emailForm.formState.errors.email?.message}
              {...emailForm.register('email')}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send reset code
            </Button>
          </form>
        )}

        {step === 1 && (
          <form className="mt-8 space-y-4" onSubmit={resetForm.handleSubmit(onResetSubmit)}>
            <Input
              label="Reset Code"
              type="text"
              placeholder="123456"
              maxLength={6}
              error={resetForm.formState.errors.code?.message}
              {...resetForm.register('code')}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={resetForm.formState.errors.newPassword?.message}
              {...resetForm.register('newPassword')}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={resetForm.formState.errors.confirmPassword?.message}
              {...resetForm.register('confirmPassword')}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Reset password
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="mt-8">
            <Link href="/login">
              <Button className="w-full">Go to login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
