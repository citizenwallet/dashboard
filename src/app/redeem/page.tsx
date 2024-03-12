import Faucet from "@/containers/ManageFaucet";
import { ConfigService } from "@citizenwallet/sdk";
import ManageFaucetTemplate from "@/templates/ManageFaucet";
import { Suspense } from "react";

export default async function Page({
  params: { slug, faucetAddress },
}: {
  params: { slug: string; faucetAddress: string };
}) {
  console.log("slug", slug);
  console.log("faucetAddress", faucetAddress);
  const configService = new ConfigService();

  // const config = await configService.getBySlug(slug);

  return (
    <Suspense fallback={<ManageFaucetTemplate />}>
      <div>hello redeem</div>
      {/* <Faucet config={config} faucetAddress={faucetAddress} /> */}
    </Suspense>
  );
}
