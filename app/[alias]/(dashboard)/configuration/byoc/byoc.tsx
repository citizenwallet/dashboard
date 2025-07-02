'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CommunityConfig, Config, getTokenMetadata } from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAddress } from 'ethers';
import { Coins, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';
import { IconUpload } from '../_components/iconUpload';
import { createByocAction, getTokenMetadataAction, uploadIconAction } from '../action';
import { useRouter } from 'next/navigation';


// Form validation schema
const byocFormSchema = z.object({
    tokenAddress: z.string()
        .min(1, 'Token address is required')
        .regex(/^0x[a-fA-F0-9]{40}$/, 'Please enter a valid Ethereum address'),
    icon: z.any().optional(),
});

interface TokenMetadata {
    decimals: number;
    symbol: string;
    name: string;
}

const chains = [
    { id: '100', name: 'Gnosis' },
    { id: '42220', name: 'Celo' },
    { id: '42161', name: 'Arbitrum' },
    { id: '137', name: 'Polygon' }
];

type BYOCFormValues = z.infer<typeof byocFormSchema>;

export default function BYOCForm({ config }: { config: Config }) {

    const [isLoading, setIsLoading] = useState(false);
    const [tokenData, setTokenData] = useState<TokenMetadata | null>(null);
    const router = useRouter();

    const form = useForm<BYOCFormValues>({
        resolver: zodResolver(byocFormSchema),
        defaultValues: {
            tokenAddress: '',
            icon: undefined,
        },
    });

    const [debouncedTokenAddress] = useDebounce(form.watch('tokenAddress'), 1000);

    useEffect(() => {
        const validateAddress = async () => {
            if (debouncedTokenAddress) {
                const isValid = isAddress(debouncedTokenAddress);
                if (isValid) {


                    const tokenMetadata = await getTokenMetadataAction(config, debouncedTokenAddress);

                    if (tokenMetadata?.decimals == null || tokenMetadata?.symbol == null || tokenMetadata?.name == null) {

                        form.setError('tokenAddress', { message: `Unable to find token, are you sure it is published on ${chains.find(chain => Number(chain.id) === config.community.primary_token.chain_id)?.name}?` });

                    } else {

                        form.clearErrors('tokenAddress');
                        setTokenData({
                            decimals: Number(tokenMetadata.decimals),
                            symbol: String(tokenMetadata.symbol),
                            name: String(tokenMetadata.name)
                        });

                    }
                } else {
                    form.setError('tokenAddress', { message: 'Invalid token address' });
                }
            }
        };
        validateAddress();
    }, [debouncedTokenAddress, form, config]);

    const onSubmit = async (data: BYOCFormValues) => {
        try {
            setIsLoading(true);

            // Handle icon upload if provided
            let iconUrl;
            if (data.icon && data.icon instanceof File) {
                iconUrl = await uploadIconAction(data.icon, config.community.alias);
            } else {
                form.setError('icon', { message: 'Icon is required' });
                return;
            }

            await createByocAction(config, data.tokenAddress, iconUrl, tokenData?.decimals ?? 0, tokenData?.symbol ?? '', tokenData?.name ?? '');
            toast.success('Configuration created successfully!',
                {
                    onAutoClose: () => {
                        router.push(`/${config.community.alias}/checkout?option=byoc&address=${data.tokenAddress}`);
                    },
                    onDismiss: () => {
                        router.push(`/${config.community.alias}/checkout?option=byoc&address=${data.tokenAddress}`);
                    }
                }
            );
            form.reset();
        } catch (error) {
            console.error('Error creating  configuration:', error);
            toast.error('Failed to create  configuration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-left space-x-4">
                <div>
                    <h1 className="text-2xl font-bold">Bring your own token (BYOT)</h1>
                    <p className="text-muted-foreground">Use an existing ERC20 token</p>
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
                            {tokenData && (
                                <div className="flex flex-col items-center justify-center p-6 rounded-lg border bg-muted space-y-2">
                                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border">
                                        <Coins className="h-12 w-12 text-orange-500/80" />
                                    </div>
                                    <div className="flex flex-col items-center space-y-1 mt-2">
                                        <span className="text-xl font-medium">{tokenData?.name}</span>
                                        <span className="text-lg text-foreground/70">{tokenData?.symbol}</span>
                                    </div>
                                </div>
                            )}

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