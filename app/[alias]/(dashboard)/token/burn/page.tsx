import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import MintTokenForm from './form';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
import { redirect } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await props.params;
  const { community: config } = await fetchCommunityByAliasAction(alias);
  const authRole = await getAuthUserRoleInCommunityAction({
    alias
  });

  if (authRole !== 'owner') {
    redirect(`/${alias}/treasury`);
  }

  return (
    <div className="flex flex-1 w-full flex-col h-full overflow-hidden">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Burn Token</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <MintTokenForm alias={alias} config={config} />
      </div>
    </div>
  );
}
