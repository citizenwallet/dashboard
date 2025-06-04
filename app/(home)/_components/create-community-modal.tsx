'use client';

import { aliasSchema, isValidAlias } from '@/app/(home)/_components/alias-utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';
import { checkAliasAction, createCommunityAction, generateUniqueSlugAction } from '../action';

// Form validation schema
const createCommunityFormSchema = z.object({
    chainId: z.string({
        required_error: 'Please select a Chain'
    }).min(1, {
        message: 'Please select a Chain'
    }),
    name: z.string({
        required_error: 'Community name is required'
    }).min(1, {
        message: 'Community name is required'
    }).max(100, {
        message: 'Community name must be 100 characters or less'
    }),
    alias: aliasSchema
});

type CreateCommunityFormData = z.infer<typeof createCommunityFormSchema>;

const chains = [
    { id: '100', name: 'Gnosis', logo: '/chainLogo/Gnosis.png' },
    { id: '42220', name: 'Celo', logo: '/chainLogo/Celo.png' },
    { id: '42161', name: 'Arbitrum', logo: '/chainLogo/Arbitrum.png' },
    { id: '137', name: 'Polygon', logo: '/chainLogo/Polygon.png' }
];

export default function CreateCommunityModal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isGeneratingAlias, startGeneratingAlias] = useTransition();
    const [isCheckingAlias, startCheckingAlias] = useTransition();

    const form = useForm<CreateCommunityFormData>({
        resolver: zodResolver(createCommunityFormSchema),
        defaultValues: {
            chainId: '',
            name: '',
            alias: ''
        }
    });

    const onSubmit = async (data: CreateCommunityFormData) => {
        setIsLoading(true);

        try {
            await createCommunityAction(data.chainId, data.name, data.alias);
            setIsOpen(false);
            toast.success('Community created successfully', {
                onAutoClose: () => {
                    router.push(`/${data.alias}`);
                },
                onDismiss: () => {
                    router.push(`/${data.alias}`);
                }
            });
        } catch (error) {
            form.setError("root", {
                type: "manual",
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
        }
    };

    const [debouncedName] = useDebounce(form.watch('name'), 1000);
    const [debouncedAlias] = useDebounce(form.watch('alias'), 1000);


    useEffect(() => {
        if (debouncedName) {
            startGeneratingAlias(async () => {
                try {
                    const alias = await generateUniqueSlugAction(debouncedName);
                    form.setValue('alias', alias);
                } catch (error) {
                    console.error('Error generating alias:', error);
                }
            });
        }
    }, [debouncedName, form]);


    useEffect(() => {
        if (debouncedAlias) {
            startCheckingAlias(async () => {
                try {
                    if (isValidAlias(debouncedAlias)) {
                        const isAvailable = await checkAliasAction(debouncedAlias);
                        if (isAvailable) {
                            setIsAvailable(false);
                            form.clearErrors("alias");
                        } else {
                            form.setError("alias", {
                                type: "manual",
                                message: "Alias is already taken"
                            });
                            setIsAvailable(true);
                        }
                    } else {
                        form.setError("alias", {
                            type: "manual",
                            message: "Invalid alias format. Alias must contain only lowercase letters, numbers, and hyphens."
                        });
                        setIsAvailable(true);
                    }
                } catch (error) {
                    console.error('Error checking alias:', error);
                    form.setError("alias", {
                        type: "manual",
                        message: error instanceof Error ? error.message : 'Error checking alias availability'
                    });
                }
            });
        }
    }, [debouncedAlias, form]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 w-40 mb-4">
                    <Plus size={16} />
                    Create Community
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Community</DialogTitle>
                    <DialogDescription>
                        Create a new community by selecting a blockchain and providing basic information.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="chainId"
                            render={({ field }) => (
                                <FormItem>
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
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Community Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter community name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="alias"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Community Alias
                                        {(isGeneratingAlias || isCheckingAlias) && (
                                            <span className="ml-2 text-sm text-gray-500">
                                                {isGeneratingAlias ? 'Generating...' : 'Checking...'}
                                            </span>
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter community alias (e.g., my-community)"
                                            {...field}
                                            disabled={isGeneratingAlias}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Alias must contain only lowercase letters, numbers, and hyphens. It will be used in your community URL.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <div className="text-sm text-red-600">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading || isAvailable}>
                                {isLoading ? 'Creating...' : 'Create Community'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 