import Sidebar from "@/components/Sidebar";
import { Flex, Separator } from "@radix-ui/themes";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <Flex className="min-h-screen bg-background font-sans antialiased">
      <Sidebar />
      <Flex direction="column">
        <Separator orientation="vertical" size="4" />
      </Flex>
      {children}
    </Flex>
  );
}
