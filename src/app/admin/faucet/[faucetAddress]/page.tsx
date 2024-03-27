import ManageFaucet from "@/containers/ManageFaucet";
import ManageFaucetTemplate from "@/templates/ManageFaucet";
import InfoPageTemplate from "@/templates/InfoPage";
import { Suspense } from "react";
import { readCommunityFile } from "@/services/community";

export default async function Page({
  params: { faucetAddress },
}: {
  params: { faucetAddress: string };
}) {
  const config = readCommunityFile();
  if (!config) {
    return <InfoPageTemplate description="Community not found" />;
  }

  return (
    <Suspense fallback={<ManageFaucetTemplate />}>
      <ManageFaucet config={config} faucetAddress={faucetAddress} />
    </Suspense>
  );
}
