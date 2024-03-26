import { communityFileExists, readCommunityHash } from "@/services/community";
import { Flex, Heading } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import Home from "@/containers/Home";
import HomeTemplate from "@/templates/Home";
import { Suspense } from "react";

export default function Page() {
  const exists = communityFileExists();
  const hash = readCommunityHash();

  if (!exists || !hash) {
    // redirect to /admin
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

  return (
    <Suspense fallback={<HomeTemplate />}>
      <Home hash={hash} appBaseUrl={appBaseUrl} appDeepLink={appDeepLink} />
    </Suspense>
  );
}
