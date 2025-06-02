'use client';

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
import { AlertCircle, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { checkAliasAction, createCommunityAction, generateUniqueSlugAction } from '../action';



interface CreateCommunityFormData {
    chainId: string;
    name: string;
    alias: string;
}

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
    const [error, setError] = useState<string | null>(null);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);

    const form = useForm<CreateCommunityFormData>({
        defaultValues: {
            chainId: '',
            name: '',
            alias: ''
        }
    });

    const onSubmit = async (data: CreateCommunityFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await createCommunityAction(data.chainId, data.name, data.alias);
            setIsOpen(false);
            toast.success('Community created successfully', {
                onAutoClose: () => {
                    router.push(`/community/${data.alias}`);
                },
                onDismiss: () => {
                    router.push(`/community/${data.alias}`);
                }
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
            setError(null);
        }
    };

    const [debouncedName] = useDebounce(form.watch('name'), 1000);
    const [debouncedAlias] = useDebounce(form.watch('alias'), 1000);


    useEffect(() => {
        if (debouncedName) {
            const generateAlias = async () => {
                const alias = await generateUniqueSlugAction(debouncedName);
                form.setValue('alias', alias);
            };
            generateAlias();
        }
    }, [debouncedName]);


    useEffect(() => {
        if (debouncedAlias) {
            const checkAlias = async () => {
                const isAvailable = await checkAliasAction(debouncedAlias);
                if (isAvailable) {
                    setIsAvailable(false);
                } else {
                    setError('Alias is already taken');
                    setIsAvailable(true);
                }
            };
            checkAlias();
        }
    }, [debouncedAlias]);

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

                {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="chainId"
                            rules={{ required: 'Please select a blockchain' }}
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
                            rules={{
                                required: 'Community name is required'
                            }}
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
                            rules={{
                                required: 'Community alias is required'
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Community Alias</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter community alias (e.g., my-community)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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