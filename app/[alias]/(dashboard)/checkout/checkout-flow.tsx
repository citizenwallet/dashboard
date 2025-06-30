'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CommunityConfig, Config, getAccountBalance } from '@citizenwallet/sdk';
import { formatUnits, Wallet } from 'ethers';
import { AlertCircle, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import QRCode from "react-qr-code";
import { useSession } from 'state/session/action';
import { deployProfileAction } from './action';


interface CheckoutFlowProps {
    option: 'byoc' | 'create';
    config: Config;
    address: string;
}


const BYOC_COST = 100;
const TOKEN_PUBLISH_COST = 200;

export function CheckoutFlow({ option, config, address }: CheckoutFlowProps) {

    // Map the option prop to the internal state values
    const selectedOption: 'byoc' | 'create' = option === 'byoc' ? 'byoc' : 'create';
    console.log("address--->", address)


    const [, sessionActions] = useSession(config);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [wallet, setWallet] = useState<string | null>(null);
    const [userAccountBalance, setUserAccountBalance] = useState<number>(0);
    const [topupUrl, setTopupUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [onprogress, setOnprogress] = useState<number>(0);

    useEffect(() => {
        const fetchAccountData = async () => {

            const privateKey = localStorage.getItem("Private_key_Deploy") || ""

            if (!privateKey) {
                const wallet = Wallet.createRandom();
                localStorage.setItem("Private_key_Deploy", wallet.privateKey);
            }

            const wallet = new Wallet(privateKey);
            setWallet(wallet.address);

            const userAddress = await sessionActions.getAccountAddress();
            setUserAddress(userAddress);

            const communityConfig = new CommunityConfig(config);

            if (userAddress) {
                const balance = await getAccountBalance(communityConfig, wallet.address);
                if (balance) {
                    setUserAccountBalance(Number(formatUnits(balance, 18)));
                }
            }

            setTopupUrl(`${window.location.origin}/onramp/pay?account=${wallet.address}&amount=${option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST}`);

        }
        fetchAccountData();
    }, [sessionActions, option, config])


    const deployContract = () => {
        startTransition(async () => {

            let profileDeploy: any;
            const communityConfig = new CommunityConfig(config);
            const chainId = communityConfig.primaryToken.chain_id.toString();

            if (option == 'byoc') {
                //- profile deploy
                profileDeploy = await deployProfileAction({
                    initializeArgs: [userAddress],
                    privateKey: localStorage.getItem("Private_key_Deploy") || "",
                    chainId: chainId
                })
                setOnprogress(40);


                // - paymaster deploy
                await new Promise(resolve => setTimeout(resolve, 10000));
                setOnprogress(80);


            } else if (option == 'create') {
                // - profile deploy
                profileDeploy = await deployProfileAction({
                    initializeArgs: [userAddress],
                    privateKey: localStorage.getItem("Private_key_Deploy") || "",
                    chainId: chainId
                })
                setOnprogress(20);


                // - paymaster deploy
                await new Promise(resolve => setTimeout(resolve, 10000));
                setOnprogress(40);


                // - token deploy
                await new Promise(resolve => setTimeout(resolve, 10000));
                setOnprogress(80);

            }

            //community config json update
            await new Promise(resolve => setTimeout(resolve, 10000));
            setOnprogress(100);

            console.log("profileDeploy--->", profileDeploy)


        });
    }

    return (
        <div className="w-full space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-4">
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

            {/* Wallet  */}
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <WalletIcon className="h-5 w-5" />
                        <CardTitle>

                            Deploying Contracts
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Waiting for CTZN tokens to be deposited
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                    <div className="space-y-4">

                        {userAccountBalance < (option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST) && (
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <p className="text-sm text-yellow-800">
                                        You have enough balance to continue. Please Top Up your account.
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="space-y-3">


                            <div>
                                {userAccountBalance < (option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST) && (
                                    <div className="space-y-4">
                                        <div className="text-sm text-muted-foreground">
                                            Insufficient balance. You need {option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST} CTZN to continue.
                                        </div>
                                        <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg">
                                            {wallet && (
                                                <>

                                                    <QRCode value={topupUrl || ''} />

                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => {
                                                            window.open(`/onramp/pay?account=${wallet}&amount=${option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST}`, '_blank');
                                                        }}
                                                    >
                                                        Top Up Account
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Current Balance:</span>
                                <Badge variant="default">
                                    {userAccountBalance} CTZN
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Required Amount:</span>
                                <Badge variant="outline">{option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST} CTZN</Badge>
                            </div>

                        </div>
                    </div>


                </CardContent>


                <CardFooter className='flex flex-col gap-4'>
                    <div className="flex items-end justify-end w-full">

                        <div className="flex gap-4">
                            <Button
                                className="flex-1"
                                // disabled={userAccountBalance < (option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST)}
                                onClick={deployContract}
                            >
                                Confirm & Publish
                                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                            </Button>
                            <Button variant="outline" className="flex-1" >
                                Cancel
                            </Button>
                        </div>

                    </div>


                    {isPending && <Progress value={onprogress} />}
                </CardFooter>

            </Card>
        </div>
    );
} 