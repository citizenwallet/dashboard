import { communityFileExists, readCommunityHash } from "@/services/community";
import { redirect } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const exists = communityFileExists();
  const hash = readCommunityHash();

  if (exists && hash) {
    // redirect to /admin
    redirect("/admin");
  }

  return <>{children}</>;
}
