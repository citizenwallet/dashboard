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
import { getCommunity } from '@/services/cw';
import { CommunityConfig, waitForTxSuccess } from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { getUserByEmailAction, submitEmailFormAction } from './actions';
import { emailFormSchema } from './form-schema';

interface EmailFormProps {
  onSuccess: (email: string) => void;
}

export default function EmailForm({ onSuccess }: EmailFormProps) {
  const [isPending, startTransition] = useTransition();

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

        if (user.role === "admin") {
          console.log("you are admin")
        }

        //This part not run on admin role
        const alias = user.users_community_access[0].alias;
        const { community } = await getCommunity(alias);
        const communityConfig = new CommunityConfig(community);

        const result = await submitEmailFormAction({
          formData: values,
          config: community
        });

        const successReceipt = await waitForTxSuccess(
          communityConfig,
          result.sessionRequestTxHash,
        );

        if (!successReceipt) {
          throw new Error("Failed to confirm transaction");
        }

        console.log(result)


        // await sendOTPAction({ email });
        // onSuccess(values.email);
        // toast.success(`Login code sent to ${values.email}`);


      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
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
