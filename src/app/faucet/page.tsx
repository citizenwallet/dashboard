import CreateFaucet from "@/containers/CreateFaucet";
import { ConfigService } from "@citizenwallet/sdk";
import CreateFaucetTemplate from "@/templates/CreateFaucet";
import { Suspense } from "react";

export default async function Page() {
  const configService = new ConfigService();

  const configs = await configService.get();

  return (
    <Suspense fallback={<CreateFaucetTemplate />}>
      <CreateFaucet communities={configs} />
    </Suspense>
  );
}
