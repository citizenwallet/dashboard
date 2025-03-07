'use client';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailFormSchema } from './form-schema';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

interface EmailFormProps {
  onSuccess: (email: string) => void;
}

export default function EmailForm({ onSuccess }: EmailFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: ''
    }
  });

  async function onSubmit(values: z.infer<typeof emailFormSchema>) {
    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        onSuccess(values.email);
        toast.success(`Login code sent to ${values.email}`);
      } catch (error) {
        toast.error('Could not send login code');
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
                      placeholder="name@example.com"
                      type="email"
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
