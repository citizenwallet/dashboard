'use client';
import { useTransition } from 'react';
import { inviteAdminFormSchema, roleEnum } from './form-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getAdminByEmailAction } from '@/app/_actions/admin-actions';
import { Config, CommunityConfig } from '@citizenwallet/sdk';
import { sendOTPAction } from '@/app/login/actions';
import { submitAdminInvitation } from './actions';

interface InviteAdminFormProps {
  alias: string;
  config: Config;
}

export default function InviteAdminForm({
  alias,
  config
}: InviteAdminFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof inviteAdminFormSchema>>({
    resolver: zodResolver(inviteAdminFormSchema),
    defaultValues: {
      email: '',
      name: '',
      //   role: 'owner',
      avatar: null,
      alias: alias
    }
  });

  async function onSubmit(values: z.infer<typeof inviteAdminFormSchema>) {
    const { email } = values;

    startTransition(async () => {
      const communityConfig = new CommunityConfig(config);
      const chainId = communityConfig.primaryToken.chain_id;

      try {
        const admin = await getAdminByEmailAction({ email, chainId });
        const isAdmin = admin?.admin_community_access.some(
          (access) => access.alias === alias
        );
        if (isAdmin) {
          throw new Error(
            `Admin ${email} already exists in ${communityConfig.community.name}`
          );
        }

        await submitAdminInvitation({ formData: values, chainId });

        await sendOTPAction({ email, chainId });

        toast.success(`Invitation sent to ${values.email}`);
        form.reset();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Could not send invitation');
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" type="email" {...field} />
              </FormControl>
              <FormDescription>
                The admin will receive an email with a link to sign in to the
                platform.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleEnum.options.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the role of the admin.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full " disabled={isPending}>
          {isPending ? 'Sending...' : 'Send invitation'}
        </Button>
      </form>
    </Form>
  );
}
