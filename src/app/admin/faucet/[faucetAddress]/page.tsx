import ManageFaucet from "@/containers/ManageFaucet";
import ManageFaucetTemplate from "@/templates/ManageFaucet";
import { Suspense } from "react";
import { readCommunityFile } from "@/utils/community";

export default async function Page({
  params: { faucetAddress },
}: {
  params: { faucetAddress: string };
}) {
  const config = readCommunityFile();

  return (
    <Suspense fallback={<ManageFaucetTemplate />}>
      <ManageFaucet config={config} faucetAddress={faucetAddress} />
    </Suspense>
  );
}