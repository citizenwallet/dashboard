'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CommunityConfig, Config, getAccountBalance } from '@citizenwallet/sdk';
import { AlertCircle, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import {
  deployPaymasterAction,
  deployProfileAction,
  deployTokenAction,
  updateCommunityConfigAction,
  sendCtznToReceiverAction
} from './action';
import Image from 'next/image';
import { formatUnits, Wallet } from 'ethers';
import { useSession } from 'state/session/action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CheckoutFlowProps {
  option: 'byoc' | 'create';
  config: Config;
  byocTokenAddress?: string;
  ctzn_config: Config;
  userAddress: string;
  initialCtznBalance: number;
}

const BYOC_COST = 100;
const TOKEN_PUBLISH_COST = 200;

export function CheckoutFlow({
  option,
  config,
  byocTokenAddress,
  ctzn_config,
  userAddress,
  initialCtznBalance
}: CheckoutFlowProps) {
  const [topupUrl, setTopupUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [onprogress, setOnprogress] = useState<number>(0);

  const [, sessionActions] = useSession(ctzn_config);

  const router = useRouter();

  const publishingCost = option === 'byoc' ? BYOC_COST : TOKEN_PUBLISH_COST;

  const myCommunityConfig = new CommunityConfig(config);

  const returnUserCtznBalance = async (): Promise<number> => {
    try {
      const ctznConfig = new CommunityConfig(ctzn_config);
      const balance = await getAccountBalance(ctznConfig, userAddress);
      return balance
        ? Number(formatUnits(balance, ctznConfig.getToken().decimals))
        : 0;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return 0;
    }
  };

  const { isPolling, startPolling, stopPolling, currentBalance } =
    pollUserBalance({
      execute: returnUserCtznBalance,
      publishingCost,
      initialBalance: initialCtznBalance
    });

  useEffect(() => {
    const createTopupUrl = async () => {
      const communityConfig = new CommunityConfig(ctzn_config);

      setTopupUrl(
        `ethereum:0x0D9B0790E97e3426C161580dF4Ee853E4A7C4607@${communityConfig.primaryToken.chain_id}/transfer?address=${userAddress}&uint256=${publishingCost}`
      );
    };
    createTopupUrl();

    if (initialCtznBalance < publishingCost) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [option, ctzn_config, userAddress, initialCtznBalance, publishingCost]);

  const deployContract = () => {
    startTransition(async () => {
      let profileDeploy: string | undefined;
      let paymasterDeploy: string | undefined;
      let tokenDeploy: string | undefined = byocTokenAddress || undefined;

      const chainId = myCommunityConfig.primaryToken.chain_id.toString();

      try {
        if (option == 'byoc') {
          //- profile deploy
          profileDeploy = await deployProfileAction({
            profileInitializeArgs: [userAddress],

            chainId: chainId
          });
          if (!profileDeploy) {
            throw new Error('Failed to deploy profile');
          }
          setOnprogress(40);

          // - paymaster deploy
          paymasterDeploy = await deployPaymasterAction({
            chainId: chainId,
            profileAddress: profileDeploy || '',
            tokenAddress: tokenDeploy || ''
          });
          if (!paymasterDeploy) {
            throw new Error('Failed to deploy paymaster');
          }

          setOnprogress(80);

          //community config json update
          await updateCommunityConfigAction({
            profileAddress: profileDeploy,
            paymasterAddress: paymasterDeploy,
            config
          });
          setOnprogress(100);
        }
        if (option == 'create') {
          // - profile deploy
          profileDeploy = await deployProfileAction({
            profileInitializeArgs: [userAddress],

            chainId: chainId
          });
          if (!profileDeploy) {
            throw new Error('Failed to deploy profile');
          }
          setOnprogress(20);

          // - token deploy
          tokenDeploy = await deployTokenAction({
            tokenInitializeArgs: [
              userAddress,
              [userAddress],
              myCommunityConfig.primaryToken.name,
              myCommunityConfig.primaryToken.symbol
            ],
            chainId: chainId
          });
          if (!tokenDeploy) {
            throw new Error('Failed to deploy token');
          }
          setOnprogress(40);

          // - paymaster deploy
          paymasterDeploy = await deployPaymasterAction({
            chainId: chainId,
            profileAddress: profileDeploy,
            tokenAddress: tokenDeploy
          });
          if (!paymasterDeploy) {
            throw new Error('Failed to deploy paymaster');
          }
          setOnprogress(80);

          //community config json update
          await updateCommunityConfigAction({
            profileAddress: profileDeploy,
            paymasterAddress: paymasterDeploy,
            config,
            tokenAddress: tokenDeploy
          });
          setOnprogress(100);
        }

        const userPrivateKey = sessionActions.storage.getKey(
          'session_private_key'
        );
        if (!userPrivateKey) {
          throw new Error('User private key not found');
        }
        const signer = new Wallet(userPrivateKey);

        const hash = await sendCtznToReceiverAction({
          signer,
          senderAddress: userAddress,
          config: ctzn_config,
          amount: publishingCost
        });

        toast.success('Contract deployed successfully', {
          description: 'Now you community is Active'
        });

        router.push(`/${config.community.alias}/treasury`);
      } catch (error) {
        console.error('Error deploying contract:', error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Error deploying contract');
        }
      }
    });
  };

  return (
    <div className="w-full space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-4">
      {/* Pricing Options */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border">
              <Avatar className="w-full h-full rounded-full">
                <AvatarImage
                  src={myCommunityConfig.community.logo}
                  alt={myCommunityConfig.community.name}
                  className="object-center"
                />
                <AvatarFallback className="rounded-full">
                  {myCommunityConfig.primaryToken.symbol}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center space-y-1 mt-2">
              <span className="text-xl font-medium">
                {myCommunityConfig.primaryToken.name}
              </span>
              <span className="text-lg text-foreground/70">
                {myCommunityConfig.primaryToken.symbol}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet  */}
      <Card>
        <CardContent className="space-y-4">
          <div className="h-1" />
          <div className="space-y-4">
            {currentBalance < publishingCost && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    You have enough balance to continue. Please Top Up your
                    account.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                {currentBalance < publishingCost && (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Insufficient balance. You need {publishingCost} CTZN to
                      continue.
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg">
                      {userAddress && (
                        <>
                          <div className="space-y-8">
                            {/* Direct top-up section */}
                            <div className="flex flex-col items-center space-y-4">
                              <div className="text-base font-medium">
                                Top up CTZN directly
                              </div>
                              <Button
                                variant="default"
                                className="w-full max-w-[200px] gap-2"
                                onClick={() => {
                                  window.open(
                                    `/onramp/pay?account=${userAddress}&amount=${publishingCost}`,
                                    '_blank'
                                  );
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
                                <span className="bg-background px-2 text-muted-foreground">
                                  Or
                                </span>
                              </div>
                            </div>

                            {/* QR Code section */}
                            <div className="flex flex-col items-center space-y-4">
                              <div className="text-base font-medium">
                                Send CTZN from any wallet
                              </div>
                              <div className="bg-white p-4 rounded-xl">
                                <QRCode value={topupUrl || ''} size={180} />
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
                    <Separator />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Balance:</span>
                <div className="flex items-center gap-2">
                  {isPolling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <Badge variant="default" className="relative">
                        <span>{currentBalance} CTZN</span>
                        <span className="absolute inset-0 bg-primary/10 animate-pulse rounded-full"></span>
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="default">{currentBalance} CTZN</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Required Amount:</span>
                <Badge variant="outline">{publishingCost} CTZN</Badge>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex items-end justify-end w-full">
            <div className="flex gap-4">
              <Button
                className="flex-1"
                disabled={currentBalance < publishingCost}
                onClick={deployContract}
              >
                Confirm & Publish
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
              <Button variant="outline" className="flex-1">
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

// Add this function inside your CheckoutFlow component
const pollUserBalance = (args: {
  execute: () => Promise<number>;
  publishingCost: number;
  initialBalance: number;
}) => {
  const { execute, publishingCost, initialBalance } = args;

  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);

  const startPolling = () => {
    setIsPolling(true);
    setPollCount(0);
  };

  const stopPolling = () => {
    setIsPolling(false);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Create an async function inside useEffect
    const checkBalance = async () => {
      try {
        // Fetch the current balance
        const balance = await execute();

        setCurrentBalance(balance);

        if (balance >= publishingCost) {
          stopPolling();
        }
      } catch (error) {
        console.error('Error checking balance:', error);
      }
    };

    if (isPolling) {
      // Run the check immediately
      checkBalance();

      // Then set up interval for subsequent checks
      intervalId = setInterval(() => {
        setPollCount((prev) => prev + 1);
        checkBalance();
      }, 5000); // Poll every 5 seconds
    }

    // Clean up the interval on unmount or when polling stops
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling, execute, publishingCost]);

  return {
    isPolling,
    pollCount,
    currentBalance,
    startPolling,
    stopPolling
  };
};
