'use client';

import { DeployOption } from './create-community-modal';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { createCommunityFormSchema } from './create-form-schema';
import { mainnetChains, testnetChains, ChainOption } from '@/lib/chain';
import { ControllerRenderProps, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebouncedCallback } from 'use-debounce';
import { useState, Dispatch, SetStateAction, useTransition } from 'react';
import {
  checkAliasAction,
  generateUniqueSlugAction,
  createCommunityAction
} from '@/app/(home)/action';
import { Loader2 } from 'lucide-react';
import { isValidAlias } from './alias-utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface CreateCommunityFormProps {
  deployOption: DeployOption;
  onSuccess: () => void;
}

export default function CreateCommunityForm({
  deployOption
}: CreateCommunityFormProps) {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [isGeneratingAlias, setIsGeneratingAlias] = useState(false);
  const [isValidatingAlias, setIsValidatingAlias] = useState(false);
  const [isSubmitting, startSubmitting] = useTransition();

  const resolvedChains =
    deployOption === 'demo'
      ? testnetChains
      : mainnetChains.filter((chain) => chain.id !== '8453');

  const form = useForm<z.infer<typeof createCommunityFormSchema>>({
    resolver: zodResolver(createCommunityFormSchema),
    defaultValues: {
      chainId: resolvedChains[0].id,
      name: '',
      alias: ''
    }
  });

  const onSubmit = (data: z.infer<typeof createCommunityFormSchema>) => {
    startSubmitting(async () => {
      try {
        const updateChainIds = [
          ...(session?.user.chainIds || []),
          parseInt(data.chainId)
        ];
        await update({
          chainIds: updateChainIds
        });

        await createCommunityAction(data.chainId, data.name, data.alias);
        toast.success('Community created successfully');

        router.push(`/${data.alias}`);
      } catch (error) {
        console.error('Error creating community:', error);

        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unknown error occurred');
        }
      } finally {
      }
    });
  };

  const debounceName = useDebouncedCallback(async (value: string) => {
    try {
      if (!value) {
        return;
      }

      const alias = await generateUniqueSlugAction(value);
      if (isValidAlias(alias)) {
        form.setValue('alias', alias);
      }
    } catch (error) {
      console.error('Error generating alias:', error);
    } finally {
      setIsGeneratingAlias(false);
    }
  }, 1000);

  const debounceAlias = useDebouncedCallback(async (value: string) => {
    try {
      if (!value) {
        return;
      }

      if (!isValidAlias(value)) {
        form.setError('alias', {
          type: 'manual',
          message:
            'Invalid alias format. Alias must contain only lowercase letters, numbers, and hyphens.'
        });
        return;
      }

      const isAvailable = await checkAliasAction(value);

      if (!isAvailable) {
        form.setError('alias', {
          type: 'manual',
          message: 'Alias is already taken'
        });
        return;
      }

      form.clearErrors('alias');
    } catch (error) {
      console.error('Error validating alias:', error);
    } finally {
      setIsValidatingAlias(false);
    }
  }, 1000);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="chainId"
          render={({ field }) => (
            <SelectBlockchain
              field={field}
              form={form}
              chains={resolvedChains}
            />
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <NameInput
              field={field}
              form={form}
              debounceName={debounceName}
              setIsGeneratingAlias={setIsGeneratingAlias}
            />
          )}
        />

        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <AliasInput
              field={field}
              form={form}
              debounceAlias={debounceAlias}
              isGeneratingAlias={isGeneratingAlias}
              isValidatingAlias={isValidatingAlias}
              setIsValidatingAlias={setIsValidatingAlias}
            />
          )}
        />

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Community'}
        </Button>
      </form>
    </Form>
  );
}

interface FormValues {
  chainId: string;
  name: string;
  alias: string;
}

interface FormFieldProps<TFieldName extends keyof FormValues> {
  field: ControllerRenderProps<FormValues, TFieldName>;
  form: UseFormReturn<FormValues>;
}

interface SelectBlockchainProps extends FormFieldProps<'chainId'> {
  chains: ChainOption[];
}

function SelectBlockchain({ field, chains }: SelectBlockchainProps) {
  const isTestnet = chains === testnetChains;

  return (
    <FormItem className={`${isTestnet ? 'hidden' : ''}`}>
      <FormLabel>Blockchain</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a blockchain" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {chains.map((chain) => (
            <SelectItem key={chain.id} value={chain.id}>
              <div className="flex items-center gap-2">
                <Image
                  src={chain.logo}
                  alt={`${chain.name} logo`}
                  width={20}
                  height={20}
                  className="rounded"
                />
                <span>{chain.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

interface NameInputProps extends FormFieldProps<'name'> {
  debounceName: (value: string) => void;
  setIsGeneratingAlias: Dispatch<SetStateAction<boolean>>;
}

function NameInput({
  field,
  debounceName,
  setIsGeneratingAlias
}: NameInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    debounceName(e.target.value);
    setIsGeneratingAlias(true);
  };

  return (
    <FormItem>
      <FormLabel>Community name</FormLabel>
      <FormControl>
        <Input
          placeholder="Enter community name"
          {...field}
          onChange={handleChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

interface AliasInputProps extends FormFieldProps<'alias'> {
  debounceAlias: (value: string) => void;
  isGeneratingAlias: boolean;
  isValidatingAlias: boolean;
  setIsValidatingAlias: Dispatch<SetStateAction<boolean>>;
}

function AliasInput({
  field,
  debounceAlias,
  isGeneratingAlias,
  isValidatingAlias,
  setIsValidatingAlias
}: AliasInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    debounceAlias(e.target.value);
    setIsValidatingAlias(true);
  };

  return (
    <FormItem>
      <FormLabel>
        Community alias
        {isGeneratingAlias && (
          <span className="ml-2 text-sm text-gray-500">Generating...</span>
        )}
        {isValidatingAlias && (
          <span className="ml-2 text-sm text-gray-500">Checking...</span>
        )}
      </FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            placeholder="Enter community alias (e.g., my-community)"
            {...field}
            onChange={handleChange}
            disabled={isGeneratingAlias}
            className={isGeneratingAlias ? 'pr-10' : ''}
          />
          {(isGeneratingAlias || isValidatingAlias) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>
        Alias must contain only lowercase letters, numbers, and hyphens. It will
        be used in your community URL.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}
