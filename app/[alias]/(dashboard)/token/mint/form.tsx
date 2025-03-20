'use client';
import { Config, CommunityConfig } from '@citizenwallet/sdk';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useRef, useTransition } from 'react';
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
import { Input } from '@/components/ui/input';
import { CommunityLogo } from '@/components/icons';
import { Textarea } from '@/components/ui/textarea';

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
      member: undefined,
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
        <AmountField form={form} config={config} />
        <DescriptionField form={form} config={config} />
        <Button type="submit" className="w-full " disabled={isPending}>
          {isPending ? 'Minting...' : 'Mint token'}
        </Button>
      </form>
    </Form>
  );
}

interface MemberFieldProps {
  form: UseFormReturn<z.infer<typeof mintTokenFormSchema>>;
  config: Config;
}

// TODO: mobile responsive design https://ui.shadcn.com/docs/components/combobox#responsive
export function MemberField({ form, config }: MemberFieldProps) {
  const { chain_id: chainId, address: profileContract } =
    config.community.profile;

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<MemberT[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    if (query.length === 0) {
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
                    'w-full justify-between',
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

interface AmountFieldProps {
  form: UseFormReturn<z.infer<typeof mintTokenFormSchema>>;
  config: Config;
}

export function AmountField({ form, config }: AmountFieldProps) {
  const communityConfig = new CommunityConfig(config);
  const primaryToken = communityConfig.primaryToken;
  const min = 0;
  const max = undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState('');
  const [value, setValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Format number to currency string
  const formatValue = (val: number): string => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseValue = (val: string): number => {
    // Remove currency symbol and commas
    const cleanValue = val.replace(/[^0-9.-]/g, '');
    const parsedValue = Number.parseFloat(cleanValue) || 0;

    // Apply min/max constraints
    if (min !== undefined && parsedValue < min) return min;
    if (max !== undefined && parsedValue > max) return max;

    return parsedValue;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input, digits, one decimal point, and minus sign at start
    if (inputValue === '' || /^-?\d*\.?\d*$/.test(inputValue)) {
      setDisplayValue(inputValue);

      if (inputValue !== '' && inputValue !== '-' && inputValue !== '.') {
        const newValue = parseValue(inputValue);
        setValue(newValue);
      } else if (inputValue === '') {
        setValue(0);
      }
    }
  };

  // Handle blur event
  const handleBlur = () => {
    setIsFocused(false);

    if (displayValue) {
      const parsedValue = parseValue(displayValue);
      setDisplayValue(formatValue(parsedValue));
      setValue(parsedValue);
    } else {
      setDisplayValue(formatValue(0));
      setValue(0);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    const parsedValue = parseValue(displayValue);
    setDisplayValue(parsedValue.toString());

    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <CommunityLogo
                  logoUrl={config.community.logo}
                  tokenSymbol={primaryToken.symbol}
                />
              </div>
              <Input
                ref={inputRef}
                type="text"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="pl-14"
                placeholder={primaryToken.decimals > 0 ? `0.00` : '0'}
              />
            </div>
          </FormControl>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface DescriptionFieldProps {
  form: UseFormReturn<z.infer<typeof mintTokenFormSchema>>;
  config: Config;
}

export function DescriptionField({ form, config }: DescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea placeholder="" className="resize-none" {...field} />
          </FormControl>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
