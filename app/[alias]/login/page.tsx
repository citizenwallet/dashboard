import { getCommunityByAlias } from "@/services/top-db/community";
import FormPage from "./form-page";
import { getServiceRoleClient } from "@/services/top-db";
import { redirect } from "next/navigation";

export default async function page({
  params
}: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;
  const client = getServiceRoleClient();
  const { data: communityData, error: communityError } = await getCommunityByAlias(client, alias);

  if (communityError || !communityData) {
    redirect('/');
  }

  return (
    <>
      <FormPage config={communityData.json} />
    </>
  )
}
