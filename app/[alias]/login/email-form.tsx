'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CommunityConfig, Config, waitForTxSuccess } from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBytes, Wallet } from 'ethers';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'state/session/action';
import { z } from 'zod';
import { generateEmailFormHashAction, getUserByEmailAction, sendEmailFormRequestAction } from './actions';
import { emailFormSchema } from './form-schema';

interface EmailFormProps {
  config: Config;
  onSuccess: (email: string) => void;
}

export default function EmailForm({ config, onSuccess }: EmailFormProps) {
  const [isPending, startTransition] = useTransition();

  const sessionActions = useSession(config);

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      type: "email",
    }
  });

  async function onSubmit(values: z.infer<typeof emailFormSchema>) {

    const { email } = values;
    startTransition(async () => {
      try {
        const user = await getUserByEmailAction({ email });

        if (!user) {
          throw new Error(`User with email ${email} not found`);
        }

        const communityConfig = new CommunityConfig(config);
        const signer = Wallet.createRandom();
        const sessionOwner = signer.address;
        const privateKey = signer.privateKey;

        const { hash, expiry } = await generateEmailFormHashAction({
          formData: values,
          sessionOwner,
          config
        });

        const hashInBytes = getBytes(hash);
        const signature = await signer.signMessage(hashInBytes);

        const result = await sendEmailFormRequestAction({
          provider: communityConfig.primarySessionConfig.provider_address,
          sessionOwner,
          formData: values,
          expiry,
          signature,
          config
        });


        const successReceipt = await waitForTxSuccess(
          communityConfig,
          result.sessionRequestTxHash,
        );

        if (!successReceipt) {
          throw new Error("Failed to confirm transaction");
        }

        sessionActions[1].storePrivateKey(privateKey);
        sessionActions[1].storeSessionHash(hash);
        sessionActions[1].storeSourceValue(values.email);
        sessionActions[1].storeSourceType(values.type);

        // await sendOTPAction({ email });
        onSuccess(values.email);
        toast.success(`Login code sent to ${values.email}`);


      } catch (error) {
        if (error instanceof Error) {
          console.log(error)
          if (error.message.includes('500')) {
            toast.error('Could not send login code now, please try again later');
          }
          else if (error.message.includes('429')) {
            toast.error('Too many requests, please try again later');
          }
          else {
            toast.error(error.message);
          }
        } else {
          toast.error('Could not send login code');
        }
      }
    });
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to continue
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send login code'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
