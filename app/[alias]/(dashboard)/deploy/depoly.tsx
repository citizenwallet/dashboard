'use client';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { deployContract } from './actions';

// Form schema with validation
const deployFormSchema = z.object({
    abi: z.string().min(1, 'Contract ABI is required').refine(
        (val) => {
            try {
                JSON.parse(val);
                return true;
            } catch {
                return false;
            }
        },
        {
            message: 'Invalid JSON format for ABI',
        }
    ),
    bytecode: z
        .string()
        .min(1, 'Bytecode is required')
        .regex(/^0x[a-fA-F0-9]+$/, 'Invalid bytecode format'),
});

type DeployFormValues = z.infer<typeof deployFormSchema>;

export default function DeployContractPage() {
    const [isDeploying, setIsDeploying] = React.useState(false);

    const form = useForm<DeployFormValues>({
        resolver: zodResolver(deployFormSchema),
        defaultValues: {
            abi: '',
            bytecode: ''
        },
    });

    async function onSubmit(data: DeployFormValues) {
        try {
            setIsDeploying(true);

            const result = await deployContract(data);

            if (result.success && result.data) {
                toast.success('Contract deployed successfully!', {
                    description: (
                        <div className="mt-2 text-xs font-mono break-all">
                            <p>Contract Address: {result.data.contractAddress}</p>
                            <p>Transaction Hash: {result.data.transactionHash || 'N/A'}</p>
                            <p>Deployed By: {result.data.deployedBy}</p>
                        </div>
                    ),
                });

                // Reset form after successful deployment
                form.reset();
            } else {
                toast.error('Failed to deploy contract', {
                    description: result.error,
                });
            }
        } catch (error) {
            toast.error('Failed to deploy contract', {
                description: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        } finally {
            setIsDeploying(false);
        }
    }

    return (
        <>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                        <FormField
                            control={form.control}
                            name="abi"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contract ABI</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="[{...}]"
                                            className="font-mono"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Paste your contract&apos;s ABI in JSON format
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bytecode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contract Bytecode</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0x..."
                                            className="font-mono"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the compiled contract bytecode (starts with 0x)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isDeploying}>
                            {isDeploying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deploying...
                                </>
                            ) : (
                                'Deploy Contract'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>

        </>
    );
}
