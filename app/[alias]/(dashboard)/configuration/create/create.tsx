'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Config } from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { IconUpload } from '../_components/iconUpload';
import { uploadIconAction } from '../action';

// Form validation schema
const createFormSchema = z.object({
    tokenName: z.string()
        .min(1, 'Token name is required')
        .max(50, 'Token name must be less than 50 characters'),
    tokenSymbol: z.string()
        .min(1, 'Token symbol is required')
        .max(4, 'Token symbol must be 4 characters or less')
        .regex(/^[A-Z0-9]+$/, 'Token symbol must contain only uppercase letters and numbers'),
    icon: z.any().refine((val) => val instanceof File, {
        message: 'Icon is required',
    }),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

export default function CreateForm({ config }: { config: Config }) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            tokenName: '',
            tokenSymbol: '',
            icon: undefined,
        },
    });

    const onSubmit = async (data: CreateFormValues) => {
        try {
            setIsLoading(true);

            // Handle icon upload if provided
            let iconUrl;
            if (data.icon && data.icon instanceof File) {
                iconUrl = await uploadIconAction(data.icon, config.community.alias);
            }

            // Prepare the token creation data
            const tokenData = {
                name: data.tokenName,
                symbol: data.tokenSymbol.toUpperCase(),
                icon: iconUrl,
                alias: config.community.alias,
            };

            console.log('tokenData-->', tokenData);

            toast.success('Configuration created successfully!');
            form.reset();
        } catch (error) {
            console.error('Error creating token configuration:', error);
            toast.error('Failed to create token configuration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-left space-x-4">
                <div>
                    <h1 className="text-2xl font-bold">Create Your Own Token</h1>
                    <p className="text-muted-foreground">Design your token</p>
                </div>
            </div>

            <Card className="w-full h-full mt-10 border-none">
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Token Name Field */}
                            <FormField
                                control={form.control}
                                name="tokenName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My Token" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the name of your token.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Token Symbol Field */}
                            <FormField
                                control={form.control}
                                name="tokenSymbol"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Symbol (typically 2-4 characters)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="MYT"
                                                maxLength={4}
                                                {...field}
                                                onChange={(e) => {
                                                    // Convert to uppercase as user types
                                                    field.onChange(e.target.value.toUpperCase());
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A short abbreviation for your token (e.g., BTC, ETH).
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