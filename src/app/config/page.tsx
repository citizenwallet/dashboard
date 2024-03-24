import { redirect } from "next/navigation";
import Config from "@/containers/Config";
import ConfigPageTemplate from "@/templates/Config";
import { communityFileExists } from "@/utils/community";
import { Suspense } from "react";

export default async function Page() {
  const exists = communityFileExists();

  if (exists) {
    // redirect to /admin
    redirect("/admin");
  }

  return (
    <Suspense fallback={<ConfigPageTemplate />}>
      <Config />
    </Suspense>
  );
}
