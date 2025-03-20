'use client';
import { Config } from '@citizenwallet/sdk';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { mintTokenFormSchema } from './form-schema';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { searchMemberToMint } from '@/app/[alias]/(dashboard)/token/actions';
import { MemberT } from '@/services/db/members';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MintTokenFormProps {
  alias: string;
  config: Config;
}

export default function MintTokenForm({ alias, config }: MintTokenFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof mintTokenFormSchema>>({
    resolver: zodResolver(mintTokenFormSchema),
    defaultValues: {
      member: null,
      amount: '0',
      description: ''
    }
  });

  async function onSubmit(values: z.infer<typeof mintTokenFormSchema>) {
    startTransition(async () => {
      try {
        toast.success(`Token minted`);
        //    router.back();
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
        <MemberField form={form} config={config} />
      </form>
    </Form>
  );
}

interface MemberFieldProps {
  form: UseFormReturn<z.infer<typeof mintTokenFormSchema>>;
  config: Config;
}

export function MemberField({ form, config }: MemberFieldProps) {
  const { chain_id: chainId, address: profileContract } =
    config.community.profile;

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<MemberT[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    if (query.length === 0) {
      setMembers([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchMemberToMint({
        query,
        chainId,
        profileContract
      });
      console.log('results', results.length);
      setMembers(results);
    } catch (error) {
      setMembers([]);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Could not search members');
      }
    } finally {
      setIsSearching(false);
    }
  }, 300); // 300ms delay

  console.log('members', members.length);

  return (
    <FormField
      control={form.control}
      name="member"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Member</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-[200px] justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? field.value.name : 'Select member'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <div className="relative">
                  <CommandInput
                    placeholder="Search member..."
                    className="h-9"
                    value={searchQuery}
                    onValueChange={(value) => {
                      setSearchQuery(value);
                      setIsSearching(true); // Show loading immediately
                      debouncedSearch(value);
                    }}
                  />
                  {isSearching && (
                    <div className="absolute right-2 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-r-primary" />
                  )}
                </div>
                <CommandList>
                  {searchQuery.length > 0 && members.length === 0 && (
                    <CommandEmpty>No members found.</CommandEmpty>
                  )}

                  <CommandGroup>
                    {members.map((member) => (
                      <CommandItem
                        key={member.id}
                        value={
                          member.id + ' ' + member.username + ' ' + member.name
                        }
                        onSelect={() => {
                          form.setValue('member', member);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage
                              src={member.image}
                              alt={member.username}
                            />
                            <AvatarFallback>
                              {member.username.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">
                              {`@${member.username}`}
                            </span>
                            <span className="text-xs font-mono truncate">
                              {member.name}
                            </span>
                          </div>
                        </div>
                        {field.value?.id === member.id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
