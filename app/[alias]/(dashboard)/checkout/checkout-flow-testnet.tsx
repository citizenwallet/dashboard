'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useSession } from 'state/session/action';
import {
  deployPaymasterAction,
  deployProfileAction,
  deployTokenAction,
  updateCommunityConfigAction
} from './action';
import Image from 'next/image';

interface CheckoutFlowProps {
  option: 'byoc' | 'create';
  config: Config;
  address?: string;
  ctzn_config: Config;
  userAddress: string;
}

export function CheckoutFlowTestnet({
  option,
  config,
  address,
  ctzn_config,
  userAddress,
}: CheckoutFlowProps) {
  const [, sessionActions] = useSession(ctzn_config);
  const [isPending, startTransition] = useTransition();
  const [onprogress, setOnprogress] = useState<number>(0);
  const router = useRouter();

  const myCommunityConfig = new CommunityConfig(config);

  const deployContract = () => {
    startTransition(async () => {
      const privateKey = sessionActions.storage.getKey('session_private_key');

      let profileDeploy: string | undefined;
      let paymasterDeploy: string | undefined;
      let tokenDeploy: string | undefined = address || undefined;

      const chainId = myCommunityConfig.primaryToken.chain_id.toString();

      try {
        if (option == 'byoc') {
          //- profile deploy
          profileDeploy = await deployProfileAction({
            initializeArgs: [userAddress || ''],
            privateKey: privateKey || '',
            chainId: chainId
          });
          setOnprogress(40);

          // - paymaster deploy
          paymasterDeploy = await deployPaymasterAction({
            privateKey: privateKey || '',
            chainId: chainId,
            profileAddress: profileDeploy || '',
            tokenAddress: tokenDeploy || ''
          });

          setOnprogress(80);

          //community config json update
          await updateCommunityConfigAction({
            profileAddress: profileDeploy || '',
            paymasterAddress: paymasterDeploy || '',
            config
          });
          setOnprogress(100);
        } else if (option == 'create') {
          // - profile deploy
          profileDeploy = await deployProfileAction({
            initializeArgs: [userAddress || ''],
            privateKey: privateKey || '',
            chainId: chainId
          });
          setOnprogress(20);

          // - token deploy
          tokenDeploy = await deployTokenAction({
            privateKey: privateKey || '',
            chainId: chainId
          });
          setOnprogress(40);

          // - paymaster deploy
          paymasterDeploy = await deployPaymasterAction({
            privateKey: privateKey || '',
            chainId: chainId,
            profileAddress: profileDeploy || '',
            tokenAddress: tokenDeploy || ''
          });
          setOnprogress(80);

          //community config json update
          await updateCommunityConfigAction({
            profileAddress: profileDeploy || '',
            paymasterAddress: paymasterDeploy || '',
            config,
            tokenAddress: tokenDeploy || ''
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
              <Image
                src={myCommunityConfig?.primaryToken?.logo || ''}
                alt={myCommunityConfig?.primaryToken?.name || ''}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
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
                  "Confirm & Publish"
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
