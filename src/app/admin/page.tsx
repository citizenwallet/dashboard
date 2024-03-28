import CommunityHome from "@/containers/CommunityHome";
import { readCommunityFile } from "@/services/community";
import { Config } from "@citizenwallet/sdk";
import InfoPageTemplate from "@/templates/InfoPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  let config: Config | undefined;
  try {
    config = readCommunityFile();
  } catch (error) {
    console.error("Error reading community file:", error);
  }

  if (!config) {
    return <InfoPageTemplate description="Community not found" />;
  }

  return <CommunityHome community={config} />;
}
