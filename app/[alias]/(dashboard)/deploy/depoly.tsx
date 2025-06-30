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
import { CheckCircle2, Copy, ExternalLink, Loader2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { deployWithProxy, ProxyDeployResult } from './proxy-deploy';

// Form schema with validation
const deployFormSchema = z.object({
    abi: z.string().min(1, 'Contract ABI is required'),
    bytecode: z.string().min(1, 'Bytecode is required'),
});

type DeployFormValues = z.infer<typeof deployFormSchema>;

export default function DeployContractPage() {
    const [isDeploying, setIsDeploying] = React.useState(false);
    const [finished, setFinished] = React.useState(false);
    const [result, setResult] = React.useState<ProxyDeployResult | null>(null);

    const form = useForm<DeployFormValues>({
        resolver: zodResolver(deployFormSchema),
        defaultValues: {
            abi: '',
            bytecode: ''
        },
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    async function onSubmit(data: DeployFormValues) {
        try {
            setIsDeploying(true);

            const result = await deployWithProxy({
                implementationABI: data.abi,
                implementationBytecode: data.bytecode,
            });

            if (result.success && result.data) {
                toast.success('Contract deployed successfully!');
                setFinished(true);
                setResult(result);
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

                {/* Deployment Results */}
                {finished && result?.data && (
                    <div className="mt-8 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/10">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                                    Contract Deployed Successfully
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {/* Contract Address */}
                                <div className="rounded-md bg-white dark:bg-black/20 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Contract Address
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => result.data && copyToClipboard(result.data.implementationAddress)}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <a
                                                href={`https://amoy.polygonscan.com/address/${result.data.implementationAddress}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-600"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm break-all">
                                        {result.data.implementationAddress}
                                    </div>
                                </div>

                                {/* Transaction Hash */}
                                <div className="rounded-md bg-white dark:bg-black/20 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Transaction Hash
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => result.data?.transactionHash && copyToClipboard(result.data.transactionHash)}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            {result.data.transactionHash && (
                                                <a
                                                    href={`https://amoy.polygonscan.com/tx/${result.data.transactionHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-600"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm break-all">
                                        {result.data.transactionHash || 'N/A'}
                                    </div>
                                </div>

                                {/* Deployer Address */}
                                <div className="rounded-md bg-white dark:bg-black/20 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Deployed By
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => result.data && copyToClipboard(result.data.proxyAddress)}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <a
                                                href={`https://amoy.polygonscan.com/address/${result.data.proxyAddress}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-600"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm break-all">
                                        {result.data.proxyAddress}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </>
    );
}
