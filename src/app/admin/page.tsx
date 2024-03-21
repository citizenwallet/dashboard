import CommunityHome from "@/containers/CommunityHome";
import CommunityHomeTemplate from "@/templates/CommunityHome";
import InfoPageTemplate from "@/templates/InfoPage";
import { Suspense } from "react";
import { readCommunityFile } from "@/utils/community";

export default async function Page() {
  const config = readCommunityFile();
  if (!config) {
    return <InfoPageTemplate description="Community not found" />;
  }

  return (
    <Suspense fallback={<CommunityHomeTemplate />}>
      <CommunityHome community={config} />
    </Suspense>
  );
}
