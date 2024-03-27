import Sidebar from "@/components/Sidebar";
import { communityFileExists, readCommunityFile } from "@/services/community";
import { Flex, Separator } from "@radix-ui/themes";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const config = readCommunityFile();

  if (!config) {
    // redirect to /admin
    redirect("/config");
  }

  return (
    <Flex className="min-h-screen bg-background font-sans antialiased">
      <Sidebar title={config.community.name} />
      <Flex direction="column">
        <Separator orientation="vertical" size="4" />
      </Flex>
      {children}
    </Flex>
  );
}
