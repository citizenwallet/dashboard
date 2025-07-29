import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { redirect } from 'next/navigation';
import MintTokenForm from './form';
import { CommunityConfig, getTwoFAAddress } from '@citizenwallet/sdk';
import { auth } from '@/auth';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
}) {
  const session = await auth();
  if (!session) {
    throw new Error('You are not logged in');
  }
  const { email } = session.user;
  if (!email) {
    throw new Error('You are not logged in');
  }

  const { alias } = await props.params;
  const client = getServiceRoleClient();
  const { data, error } = await getCommunityByAlias(client, alias);

  if (error || !data) {
    throw new Error('Failed to get community by alias');
  }

  const config = data.json;
  const authRole = await getAuthUserRoleInCommunityAction({
    alias
  });

  if (authRole !== 'owner') {
    redirect(`/${alias}/treasury`);
  }

    const communityConfig = new CommunityConfig(config);
    const twoFAAddress = await getTwoFAAddress({
      community: communityConfig,
      source: email,
      type: 'email'
    });

  return (
    <div className="flex flex-1 w-full flex-col h-full overflow-hidden">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Mint Token</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <MintTokenForm
          alias={alias}
          config={config}
          userAddress={twoFAAddress ?? ''}
        />
      </div>
    </div>
  );
}
