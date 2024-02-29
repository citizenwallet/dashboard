import { Flex, Heading } from "@radix-ui/themes";
import Faucet from "@/containers/Faucet";
import { ConfigService } from "@citizenwallet/sdk";
import { Suspense } from "react";

export default async function Page({
  params: { faucetAddress },
  searchParams: { slug },
}: {
  params: { faucetAddress: string };
  searchParams: { slug: string };
}) {
  const configService = new ConfigService();

  const config = await configService.getBySlug(slug);

  return (
    <Flex direction="column" height="100%" width="100%">
      <Suspense fallback={<div>Loading...</div>}>
        <Faucet config={config} faucetAddress={faucetAddress} />
      </Suspense>
    </Flex>
  );
}
