'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  deployPaymasterAction,
  deployProfileAction,
  deployTokenAction,
  updateCommunityConfigAction
} from './action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CheckoutFlowProps {
  option: 'byoc' | 'create';
  config: Config;
  byocTokenAddress?: string;
  userAddress: string;
}

export function CheckoutFlowTestnet({
  option,
  config,
  byocTokenAddress,
  userAddress
}: CheckoutFlowProps) {
  const [isPending, startTransition] = useTransition();
  const [onprogress, setOnprogress] = useState<number>(0);
  const router = useRouter();

  const myCommunityConfig = new CommunityConfig(config);

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
          if (!tokenDeploy) {
            throw new Error(
              'Token address is required for paymaster deployment'
            );
          }
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

        toast.success('Contract deployed successfully', {
          description: 'Now you community is Active'
        });

        router.push(`/${config.community.alias}/treasury`);
      } catch (error) {
        console.error('Error deploying contract:', error);
        toast.error('Error deploying contract');
      }
    });
  };

  return (
    <div className="w-full space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] p-4">
      {/* Community Info */}
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
        <CardFooter className="flex flex-col gap-4 p-6">
          <div className="w-full">
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                className="min-w-[120px]"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                className="min-w-[160px]"
                onClick={deployContract}
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center">
                    Publishing <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  'Confirm & Publish'
                )}
              </Button>
            </div>
          </div>

          {isPending && <Progress value={onprogress} className="mt-4" />}
        </CardFooter>
      </Card>
    </div>
  );
}
