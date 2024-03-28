import ManageFaucet from "@/containers/ManageFaucet";
import ManageFaucetTemplate from "@/templates/ManageFaucet";
import InfoPageTemplate from "@/templates/InfoPage";
import { Suspense } from "react";
import { readCommunityFile } from "@/services/community";
import { Config } from "@citizenwallet/sdk";

export const dynamic = "force-dynamic";

export default async function Page({
  params: { faucetAddress },
}: {
  params: { faucetAddress: string };
}) {
  let config: Config | undefined;
  try {
    config = readCommunityFile();
  } catch (error) {
    console.error("Error reading community file:", error);
  }

  if (!config) {
    return <InfoPageTemplate description="Community not found" />;
  }

  return (
    <Suspense fallback={<ManageFaucetTemplate />}>
      <ManageFaucet config={config} faucetAddress={faucetAddress} />
    </Suspense>
  );
}
