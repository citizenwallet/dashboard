import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import InviteAdminForm from './form';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
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
