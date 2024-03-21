import CreateFaucet from "@/containers/CreateFaucet";
import CreateFaucetTemplate from "@/templates/CreateFaucet";
import InfoPageTemplate from "@/templates/InfoPage";
import { Suspense } from "react";
import { readCommunityFile } from "@/utils/community";

export default async function Page() {
  const config = readCommunityFile();
  if (!config) {
    return <InfoPageTemplate description="Community not found" />;
  }

  return (
    <Suspense fallback={<CreateFaucetTemplate />}>
      <CreateFaucet community={config} />
    </Suspense>
  );
}
