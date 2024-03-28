import Sidebar from "@/components/Sidebar";
import { readCommunityFile } from "@/services/community";
import { Flex, Separator } from "@radix-ui/themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  const config = readCommunityFile();

  return (
    <Flex className="min-h-screen bg-background font-sans antialiased">
      {config && <Sidebar title={config.community.name} />}
      <Flex direction="column">
        <Separator orientation="vertical" size="4" />
      </Flex>
      {children}
    </Flex>
  );
}
