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
import { Mail } from 'lucide-react';
import { signInWithOTP } from './actions';
import { useRouter } from 'next/navigation';

interface OtpFormProps {
  email: string;
  onBack: () => void;
  resendCountDown: number;
  onResend: (email: string) => void;
}

export default function OtpForm({
  email,
  onBack,
  resendCountDown,
  onResend
}: OtpFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: ''
    }
  });

  async function onSubmit(values: z.infer<typeof otpFormSchema>) {
    const { code } = values;
    startTransition(async () => {
      try {
        const result = await signInWithOTP({ email, code });
        if (result?.success) {
          toast.success('Login successful!');
          router.push('/');
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          // Display the exact error message from auth.config.ts
          toast.error(error.message);
        } else {
          toast.error('Could not verify login code');
        }
      }
    });
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-2 text-center flex flex-col items-center">
          <h1 className="text-2xl font-bold">Verify Login</h1>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit login code to your email {email}. Please
            enter it below
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-center mb-2">Login Code</FormLabel>
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

        <div className="h-4" />

        <Button
          variant="ghost"
          className="w-full"
          disabled={isPending || resendCountDown > 0}
          onClick={() => onResend(email)}
        >
          {resendCountDown > 0
            ? `Resend code in ${resendCountDown}s`
            : 'Resend login code'}
        </Button>
      </CardContent>
      <CardFooter className="flex">
        <span
          className="text-sm text-muted-foreground text-center w-full cursor-pointer"
          onClick={onBack}
        >
          Try a different email
        </span>
      </CardFooter>
    </Card>
  );
}
