import CreateFaucet from "@/containers/CreateFaucet";
import CreateFaucetTemplate from "@/templates/CreateFaucet";
import { Suspense } from "react";
import { readCommunityFile } from "@/utils/community";

export default async function Page() {
  const config = readCommunityFile();

  return (
    <Suspense fallback={<CreateFaucetTemplate />}>
      <CreateFaucet community={config} />
    </Suspense>
  );
}
