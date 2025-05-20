import { getCommunity } from "@/services/cw";
import FormPage from "./form-page";

export default async function page({
  params
}: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;
  const { community } = await getCommunity(alias);

  return (
    <>
      <FormPage config={community} />
    </>
  )
}
