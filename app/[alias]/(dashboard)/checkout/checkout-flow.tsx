'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Separator } from '@/components/ui/separator';
import { CommunityConfig, Config, getAccountBalance } from '@citizenwallet/sdk';
import { formatUnits } from 'ethers';
import { AlertCircle, Coins, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import QRCode from "react-qr-code";
import { useSession } from 'state/session/action';
import { getTokenMetadataAction } from '../configuration/action';
import { deployPaymasterAction, deployProfileAction, deployTokenAction, updateCommunityConfigAction } from './action';


interface CheckoutFlowProps {
    option: 'byoc' | 'create';
    config: Config;
    address?: string;
    ctzn_config: Config;
}


const BYOC_COST = 100;
const TOKEN_PUBLISH_COST = 200;

export function CheckoutFlow({ option, config, address, ctzn_config }: CheckoutFlowProps) {


    const [, sessionActions] = useSession(ctzn_config);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [userAccountBalance, setUserAccountBalance] = useState<number>(0);
    const [topupUrl, setTopupUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [onprogress, setOnprogress] = useState<number>(0);

    const [tokenName, setTokenName] = useState<string | null>(null);
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccountData = async () => {
            const userAddress = await sessionActions.getAccountAddress();
            setUserAddress(userAddress);


            const communityConfig = new CommunityConfig(ctzn_config);

            if (userAddress) {
                const balance = await getAccountBalance(communityConfig, userAddress);
                if (balance) {
                    setUserAccountBalance(Number(formatUnits(balance, 18)));
                }
            }

            setTopupUrl(`ethereum:0x0D9B0790E97e3426C161580dF4Ee853E4A7C4607@${communityConfig.primaryToken.chain_id}/transfer?address=${userAddress}&uint256=${option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST}`);

        }
        fetchAccountData();
    }, [sessionActions, option, config])

    useEffect(() => {
        const fetchTokenData = async () => {
            if (option == 'create') {

                const communityConfig = new CommunityConfig(config);
                setTokenName(communityConfig.primaryToken.name);
                setTokenSymbol(communityConfig.primaryToken.symbol);

            } else if (option == 'byoc') {

                const tokenMetadata = await getTokenMetadataAction(config, address || '');
                setTokenName(String(tokenMetadata?.name));
                setTokenSymbol(String(tokenMetadata?.symbol));
            }
        }
        fetchTokenData();
    }, [config])

    const deployContract = () => {
        startTransition(async () => {

            const privateKey = sessionActions.storage.getKey('session_private_key');

            let profileDeploy: string | undefined;
            let paymasterDeploy: string | undefined;
            let tokenDeploy: string | undefined = address || undefined;

            const communityConfig = new CommunityConfig(config);
            const chainId = communityConfig.primaryToken.chain_id.toString();

            if (option == 'byoc') {

                //- profile deploy
                profileDeploy = await deployProfileAction({
                    initializeArgs: [userAddress || ''],
                    privateKey: privateKey || '',
                    chainId: chainId
                })
                setOnprogress(40);

                // - paymaster deploy
                paymasterDeploy = await deployPaymasterAction({
                    privateKey: privateKey || '',
                    chainId: chainId,
                    profileAddress: profileDeploy || '',
                    tokenAddress: tokenDeploy || ''
                })

                setOnprogress(80);

                console.log("profileDeploy--->", profileDeploy, "paymasterDeploy--->", paymasterDeploy)
                console.log("config--->", config)

                //community config json update
                const updateJson = await updateCommunityConfigAction(profileDeploy || '', paymasterDeploy || '', config);
                console.log("updateJson--->", updateJson)
                setOnprogress(100);




            } else if (option == 'create') {
                // - profile deploy
                profileDeploy = await deployProfileAction({
                    initializeArgs: [userAddress || ''],
                    privateKey: privateKey || '',
                    chainId: chainId
                })
                setOnprogress(20);

                // - token deploy
                tokenDeploy = await deployTokenAction({
                    privateKey: privateKey || '',
                    chainId: chainId
                })
                setOnprogress(40);

                // - paymaster deploy
                paymasterDeploy = await deployPaymasterAction({
                    privateKey: privateKey || '',
                    chainId: chainId,
                    profileAddress: profileDeploy || '',
                    tokenAddress: tokenDeploy || ''
                })
                setOnprogress(80);


                //community config json update
                await new Promise(resolve => setTimeout(resolve, 10000));
                setOnprogress(100);

                console.log("profileDeploy--->", profileDeploy, "paymasterDeploy--->", paymasterDeploy)

            }

        });
    }

    return (
        <div className="w-full space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-4">
            {/* Pricing Options */}
            <Card>
                <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-6 rounded-lg border space-y-2">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border">
                            <Coins className="h-12 w-12 text-orange-500/80" />
                        </div>
                        <div className="flex flex-col items-center space-y-1 mt-2">
                            <span className="text-xl font-medium">{tokenName}</span>
                            <span className="text-lg text-foreground/70">{tokenSymbol}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Wallet  */}
            <Card>

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
                                            {userAddress && (
                                                <>
                                                    <div className="space-y-8">
                                                        {/* Direct top-up section */}
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className="text-base font-medium">Top up CTZN directly</div>
                                                            <Button
                                                                variant="default"
                                                                className="w-full max-w-[200px] gap-2"
                                                                onClick={() => {
                                                                    window.open(`/onramp/pay?account=${userAddress}&amount=${option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST}`, '_blank');
                                                                }}
                                                            >
                                                                <WalletIcon className="h-4 w-4" />
                                                                Top Up Account
                                                            </Button>
                                                        </div>

                                                        {/* Divider with text */}
                                                        <div className="relative">
                                                            <div className="absolute inset-0 flex items-center">
                                                                <div className="w-full border-t border-muted" />
                                                            </div>
                                                            <div className="relative flex justify-center text-xs uppercase">
                                                                <span className="bg-background px-2 text-muted-foreground">Or</span>
                                                            </div>
                                                        </div>

                                                        {/* QR Code section */}
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className="text-base font-medium">Send CTZN from any wallet</div>
                                                            <div className="bg-white p-4 rounded-xl">
                                                                <QRCode
                                                                    value={topupUrl || ''}
                                                                    size={180}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <AlertCircle className="h-4 w-4" />
                                                                Make sure you are sending on Polygon
                                                            </div>
                                                        </div>
                                                    </div>
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
                                disabled={userAccountBalance < (option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST)}
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