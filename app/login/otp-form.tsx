'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpFormSchema } from './form-schema';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface OtpFormProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function OtpForm({ email, onBack, onSuccess }: OtpFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: ''
    }
  });

  async function onSubmit(values: z.infer<typeof otpFormSchema>) {
    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        onSuccess();
        toast.success('Login successful');
      } catch (error) {
        toast.error('Could not verify login code');
      }
    });
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Verify Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter the one-time password sent to {email}
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-center mb-2">
                    One-Time Password
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-12 text-2xl"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Verifying...' : 'Verify login code'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex">
        <div className="text-center text-sm">
          Didn&apos;t receive login code?{' '}
          <span
            className="font-medium underline underline-offset-4 hover:text-primary"
            onClick={onBack}
          >
            Resend login code
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
