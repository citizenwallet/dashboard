'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { IconUpload } from '../_components/iconUpload';

// Form validation schema
const byocFormSchema = z.object({
    tokenAddress: z.string()
        .min(1, 'Token address is required')
        .regex(/^0x[a-fA-F0-9]{40}$/, 'Please enter a valid Ethereum address'),
    icon: z.any().optional(),
});

type BYOCFormValues = z.infer<typeof byocFormSchema>;

export default function BYOCForm({ alias }: { alias: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<BYOCFormValues>({
        resolver: zodResolver(byocFormSchema),
        defaultValues: {
            tokenAddress: '',
            icon: undefined,
        },
    });

    const onSubmit = async (data: BYOCFormValues) => {
        try {
            setIsLoading(true);

            // Handle icon upload if provided
            let iconUrl;
            if (data.icon && data.icon instanceof File) {
                // TODO: Implement icon upload logic
                // iconUrl = await uploadIconAction(data.icon, alias);
                console.log('Icon file:', data.icon);
            }

            // Prepare the BYOC configuration data
            const byocData = {
                tokenAddress: data.tokenAddress,
                icon: iconUrl,
                alias: alias,
            };

            // TODO: Implement the actual BYOC configuration creation
            console.log('BYOC Configuration:', byocData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            toast.success('BYOC configuration created successfully!');

            // Reset form after successful submission
            form.reset();
        } catch (error) {
            console.error('Error creating BYOC configuration:', error);
            toast.error('Failed to create BYOC configuration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-left space-x-4">
                <div>
                    <h1 className="text-2xl font-bold">Bring Your Own Currency</h1>
                    <p className="text-muted-foreground">Configure your existing ERC20 token</p>
                </div>
            </div>

            <Card className="w-full h-full mt-10 border-none">
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Token Address Field */}
                            <FormField
                                control={form.control}
                                name="tokenAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency address (ERC20 Token)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0x..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the contract address of your ERC20 token.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Icon Upload Field */}
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon</FormLabel>
                                        <FormControl>
                                            <IconUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Upload your logo in SVG or PNG format. It will be stored securely in our storage.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4 flex justify-end items-end">
                                <Button
                                    type="submit"
                                    className="w-full md:w-96"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Creating Configuration...
                                        </>
                                    ) : (
                                        'Create Configuration'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}