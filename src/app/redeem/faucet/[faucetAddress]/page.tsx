import RedeemFaucet from "@/containers/RedeemFaucet";
import RedeemFaucetTemplate from "@/templates/RedeemFaucet";
import { Suspense } from "react";
import { readCommunityFile } from "@/services/community";
import { Config } from "@citizenwallet/sdk";
import InfoPageTemplate from "@/templates/InfoPage";

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

  const appBaseUrl = process.env.APP_BASE_URL;

  if (!appBaseUrl) {
    throw new Error("Missing APP_BASE_URL environment variable");
  }

  const appDeepLink = process.env.NATIVE_APP_DEEP_LINK;

  if (!appDeepLink) {
    throw new Error("Missing NATIVE_APP_DEEP_LINK environment variable");
  }

  return (
    <Suspense fallback={<RedeemFaucetTemplate />}>
      <RedeemFaucet
        config={config}
        faucetAddress={faucetAddress}
        appBaseUrl={appBaseUrl}
        appDeepLink={appDeepLink}
      />
    </Suspense>
  );
}
