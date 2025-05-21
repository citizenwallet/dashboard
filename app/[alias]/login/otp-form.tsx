'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { CommunityConfig, Config, waitForTxSuccess } from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'state/session/action';
import { z } from 'zod';
import { getUserByEmailAction, signInWithOutOTP, submitOtpFormAction } from './actions';
import { otpFormSchema } from './form-schema';


interface OtpFormProps {
  email: string;
  config: Config;
  onBack: () => void;
  resendCountDown: number;
  onResend: (email: string) => void;
}

export default function OtpForm({
  email,
  config,
  onBack,
  resendCountDown,
  onResend
}: OtpFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [sessionState, sessionActions] = useSession(config);

  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
      sessionRequestHash: sessionState((state) => state.hash) ?? "",
      privateKey: sessionState((state) => state.privateKey) ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof otpFormSchema>) {

    startTransition(async () => {
      try {

        const user = await getUserByEmailAction({ email });

        if (!user) {
          throw new Error(`User with email ${email} not found`);
        }


        const communityConfig = new CommunityConfig(config);

        const result = await submitOtpFormAction({
          formData: values,
          config,
        });

        const successReceipt = await waitForTxSuccess(
          communityConfig,
          result.sessionRequestTxHash,
        );

        if (!successReceipt) {
          throw new Error("Failed to confirm transaction");
        }

        const address = await sessionActions.getAccountAddress();

        if (!address) {
          throw new Error("Failed to create account");
        }

        console.log("accountAddress", address)

        const alias = config.community.alias;
        const response = await signInWithOutOTP({ email, address, alias });
        if (response?.success) {
          toast.success('Login successful!');
          router.push(`/${alias}`);
        }

      } catch (error) {
        if (error instanceof Error) {
          console.log(error)
          if (error.message.includes('500')) {
            toast.error('Could not verify login code now, please try again later', {
              onAutoClose: () => {
                const alias = config.community.alias;
                router.push(`/${alias}`);
              }
            });
          } else {
            toast.error(error.message);
          }
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
                    <InputOTP
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\d{6}"
                      maxLength={6}
                      required
                      {...field}
                    >
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
