import CommunityHome from "@/containers/CommunityHome";
import CommunityHomeTemplate from "@/templates/CommunityHome";
import { Suspense } from "react";
import { readCommunityFile } from "@/utils/community";

export default async function Page() {
  const config = readCommunityFile();

  return (
    <Suspense fallback={<CommunityHomeTemplate />}>
      <CommunityHome community={config} />
    </Suspense>
  );
}
