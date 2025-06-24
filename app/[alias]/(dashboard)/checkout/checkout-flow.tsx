'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wallet } from 'ethers';
import { Config, CommunityConfig, getAccountAddress } from '@citizenwallet/sdk';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, ExternalLink, Loader2, Wallet as WalletIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CheckoutFlowProps {
    config: Config;
    alias: string;
}

type CheckoutStatus = 'idle' | 'generating' | 'waiting_for_funds' | 'sufficient_funds' | 'processing' | 'completed' | 'cancelled';

const BYOC_COST = 50; // CTZN tokens for BYOC
const TOKEN_PUBLISH_COST = 100; // CTZN tokens for publishing token as well

export function CheckoutFlow({ config, alias }: CheckoutFlowProps) {
    const [status, setStatus] = useState<CheckoutStatus>('idle');
    const [privateKey, setPrivateKey] = useState<string>('');
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [accountAddress, setAccountAddress] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<'byoc' | 'with_token'>('byoc');
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

    const requiredAmount = selectedOption === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST;
    const hasSufficientFunds = balance >= requiredAmount;

    // Generate private key and addresses
    const generateKeyPair = useCallback(async () => {
        setStatus('generating');
        try {
            const wallet = Wallet.createRandom();
            const communityConfig = new CommunityConfig(config);

            const accountAddr = await getAccountAddress(
                communityConfig,
                wallet.address
            );

            setPrivateKey(wallet.privateKey);
            setWalletAddress(wallet.address);
            setAccountAddress(accountAddr);
            setStatus('waiting_for_funds');

            // Start polling for balance
            startBalancePolling(accountAddr);
        } catch (error) {
            console.error('Error generating key pair:', error);
            toast.error('Failed to generate wallet. Please try again.');
            setStatus('idle');
        }
    }, [config]);

    // Mock balance polling function - replace with actual CTZN balance API
    const checkBalance = useCallback(async (address: string): Promise<number> => {
        // TODO: Replace with actual CTZN balance API call
        // For now, simulate random balance changes for demo
        return Math.floor(Math.random() * 150);
    }, []);

    const startBalancePolling = useCallback((address: string) => {
        const interval = setInterval(async () => {
            try {
                const currentBalance = await checkBalance(address);
                setBalance(currentBalance);

                if (currentBalance >= requiredAmount) {
                    setStatus('sufficient_funds');
                    clearInterval(interval);
                    setPollingInterval(null);
                }
            } catch (error) {
                console.error('Error checking balance:', error);
            }
        }, 3000); // Poll every 3 seconds

        setPollingInterval(interval);
    }, [checkBalance, requiredAmount]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const handleCopyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const handleTransakFlow = () => {
        // TODO: Implement Transak flow
        window.open('https://transak.com', '_blank');
    };

    const handleConfirm = async () => {
        setStatus('processing');
        try {
            // TODO: Implement actual contract publishing logic
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
            setStatus('completed');
            toast.success('Community contracts have been published successfully.');
        } catch (error) {
            console.error('Error processing confirmation:', error);
            toast.error('Failed to publish contracts. Please try again.');
            setStatus('sufficient_funds');
        }
    };

    const handleCancel = async () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }

        if (balance > 0) {
            // TODO: Implement logic to send CTZN back
            toast.success('Sending CTZN tokens back to your wallet...');
        }

        setStatus('cancelled');
        // Reset all state
        setPrivateKey('');
        setWalletAddress('');
        setAccountAddress('');
        setBalance(0);
        setStatus('idle');
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'generating':
            case 'processing':
                return <Loader2 className="h-5 w-5 animate-spin" />;
            case 'sufficient_funds':
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'waiting_for_funds':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            default:
                return <WalletIcon className="h-5 w-5" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'generating':
                return 'Generating wallet...';
            case 'waiting_for_funds':
                return 'Waiting for CTZN tokens...';
            case 'sufficient_funds':
                return 'Ready to publish contracts';
            case 'processing':
                return 'Publishing contracts...';
            case 'completed':
                return 'Contracts published successfully!';
            default:
                return 'Ready to start';
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Pricing Options */}
            <Card>
                <CardHeader>
                    <CardTitle>Choose your publishing option</CardTitle>
                    <CardDescription>
                        You can obtain CTZN tokens through Citizen Wallet
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    < div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                        <div
                            className={cn(
                                "relative cursor-pointer rounded-lg border p-4 transition-colors",
                                selectedOption === 'byoc'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted hover:border-primary/50'
                            )}
                            onClick={() => setSelectedOption('byoc')}
                        >
                            <div className="flex items-center space-x-2">
                                <div className={cn(
                                    "h-4 w-4 rounded-full border-2",
                                    selectedOption === 'byoc'
                                        ? 'border-primary bg-primary'
                                        : 'border-muted-foreground'
                                )} />
                                <div className="flex-1">
                                    <p className="font-semibold">BYOC (Bring Your Own Community)</p>
                                    <p className="text-sm text-muted-foreground">Deploy community contracts only</p>
                                </div>
                                <Badge variant="secondary">{BYOC_COST} CTZN</Badge>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "relative cursor-pointer rounded-lg border p-4 transition-colors",
                                selectedOption === 'with_token'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted hover:border-primary/50'
                            )}
                            onClick={() => setSelectedOption('with_token')}
                        >
                            <div className="flex items-center space-x-2">
                                <div className={cn(
                                    "h-4 w-4 rounded-full border-2",
                                    selectedOption === 'with_token'
                                        ? 'border-primary bg-primary'
                                        : 'border-muted-foreground'
                                )} />
                                <div className="flex-1">
                                    <p className="font-semibold">With Token Publishing</p>
                                    <p className="text-sm text-muted-foreground">Deploy contracts + publish token</p>
                                </div>
                                <Badge variant="secondary">{TOKEN_PUBLISH_COST} CTZN</Badge>
                            </div>
                        </div>
                    </div >
                </CardContent >
            </Card >

            {/* Wallet Generation and Status */}
            < Card >
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        {getStatusIcon()}
                        <CardTitle>{getStatusText()}</CardTitle>
                    </div>
                    <CardDescription>
                        {status === 'idle' && 'Generate a temporary wallet to receive CTZN tokens'}
                        {status === 'waiting_for_funds' && `Send ${requiredAmount} CTZN to the address below`}
                        {status === 'sufficient_funds' && 'You have sufficient funds to proceed'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {status === 'idle' && (
                        <Button onClick={generateKeyPair} className="w-full">
                            Generate Wallet
                        </Button>
                    )}

                    {(status === 'waiting_for_funds' || status === 'sufficient_funds') && (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <p className="text-sm text-yellow-800">
                                        This is a temporary wallet generated for this transaction only.
                                        Do not use it for storing funds long-term.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium">Wallet Address</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                                            {walletAddress}
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopyToClipboard(walletAddress, 'Wallet address')}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Account Address</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                                            {accountAddress}
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopyToClipboard(accountAddress, 'Account address')}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Current Balance:</span>
                                    <Badge variant={hasSufficientFunds ? 'default' : 'secondary'}>
                                        {balance} CTZN
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Required Amount:</span>
                                    <Badge variant="outline">{requiredAmount} CTZN</Badge>
                                </div>

                                {!hasSufficientFunds && (
                                    <Button
                                        variant="outline"
                                        onClick={handleTransakFlow}
                                        className="w-full"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Get CTZN via Transak
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {status === 'processing' && (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                                Publishing your community contracts...
                            </p>
                        </div>
                    )}

                    {status === 'completed' && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <p className="text-sm text-green-800">
                                    Your community has been successfully activated! You can now start inviting members and managing your community.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>

                {
                    (status === 'sufficient_funds' || status === 'waiting_for_funds') && (
                        <CardFooter className="flex gap-2">
                            <Button
                                onClick={handleConfirm}
                                disabled={!hasSufficientFunds || status === 'processing'}
                                className="flex-1"
                            >
                                {status === 'processing' ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    'Confirm & Publish'
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={status === 'processing'}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </CardFooter>
                    )
                }
            </Card >
        </div >
    );
} 