import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { redirect } from 'next/navigation';
import InviteAdminForm from './form';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
}) {
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
    redirect(`/${alias}/admins`);
  }

  return (
    <div className="flex flex-1 flex-col items-center w-full overflow-y-auto">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Invite admin</CardTitle>
          <CardDescription>Invite an admin to your community</CardDescription>
        </CardHeader>
        <CardContent>
          <InviteAdminForm alias={alias} config={config} />
        </CardContent>
      </Card>
    </div>
  );
}
