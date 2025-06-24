'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AlertCircle, Copy, Wallet as WalletIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CheckoutFlowProps {
    option: 'byoc' | 'create';
}

type CheckoutStatus = 'idle' | 'waiting_for_funds';

const BYOC_COST = 50;
const TOKEN_PUBLISH_COST = 100;

export function CheckoutFlow({ option }: CheckoutFlowProps) {


    const [status, setStatus] = useState<CheckoutStatus>('idle');

    // Map the option prop to the internal state values
    const selectedOption: 'byoc' | 'create' = option === 'byoc' ? 'byoc' : 'create';

    // Generate private key and addresses
    const generateKeyPair = async () => {
        setStatus('waiting_for_funds');
        try {

            //create a temporary wallet

        } catch (error) {
            console.error('Error generating key pair:', error);
            toast.error('Failed to generate wallet. Please try again.');
            setStatus('idle');
        }
    };


    const handleCopyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            className={cn(
                                "relative rounded-lg border p-4",
                                selectedOption === 'byoc'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted'
                            )}
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
                                "relative rounded-lg border p-4",
                                selectedOption === 'create'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted'
                            )}
                        >
                            <div className="flex items-center space-x-2">
                                <div className={cn(
                                    "h-4 w-4 rounded-full border-2",
                                    selectedOption === 'create'
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
                    </div>
                </CardContent>
            </Card>

            {/* Wallet Generation and Status */}
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <WalletIcon className="h-5 w-5" />
                        <CardTitle>
                            {status === 'idle' && 'Generate a temporary wallet to receive CTZN tokens'}
                            {status === 'waiting_for_funds' && 'Waiting for CTZN tokens'}
                        </CardTitle>
                    </div>
                    <CardDescription>
                        {status === 'idle'}
                        {status === 'waiting_for_funds'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {status === 'idle' && (
                        <Button onClick={generateKeyPair} className="flex justify-end">
                            Generate Wallet
                        </Button>
                    )}

                    {(status === 'waiting_for_funds') && (
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
                                            0x1D1479C185d32EB90533a08b36B3CFa5F84A0E6B
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopyToClipboard('0x1D1479C185d32EB90533a08b36B3CFa5F84A0E6B', 'Wallet address')}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Account Address</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                                            0x1D1479C185d32EB90533a08b36B3CFa5F84A0E6B
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopyToClipboard('0x1D1479C185d32EB90533a08b36B3CFa5F84A0E6B', 'Account address')}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Current Balance:</span>
                                    <Badge variant="default">
                                        10 CTZN
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Required Amount:</span>
                                    <Badge variant="outline">10 CTZN</Badge>
                                </div>

                            </div>
                        </div>
                    )}

                </CardContent>

                {
                    (status != 'idle') && (
                        <CardFooter className="flex gap-2">
                            <Button
                                className="flex-1"
                            >

                                Confirm & Publish

                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </CardFooter>
                    )
                }
            </Card>
        </div>
    );
} 