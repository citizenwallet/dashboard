import { communityFileExists, readCommunityHash } from "@/services/community";
import { redirect } from "next/navigation";
import Home from "@/containers/Home";

export const dynamic = "force-dynamic";

export default function Page() {
  const exists = communityFileExists();
  const hash = readCommunityHash();

  if (!exists || !hash) {
    // redirect to /config
    redirect("/config");
  }

  const appBaseUrl = process.env.APP_BASE_URL;

  if (!appBaseUrl) {
    throw new Error("Missing APP_BASE_URL environment variable");
  }

  const appDeepLink = process.env.NATIVE_APP_DEEP_LINK;

  if (!appDeepLink) {
    throw new Error("Missing NATIVE_APP_DEEP_LINK environment variable");
  }

  return <Home hash={hash} appBaseUrl={appBaseUrl} appDeepLink={appDeepLink} />;
}
