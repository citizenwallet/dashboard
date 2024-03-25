import { communityFileExists, readCommunityHash } from "@/services/community";
import { Flex, Heading } from "@radix-ui/themes";
import { redirect } from "next/navigation";

export default function Page() {
  const exists = communityFileExists();
  const hash = readCommunityHash();

  if (!exists || !hash) {
    // redirect to /admin
    redirect("/config");
  }

  return (
    <Flex direction="column" height="100%" width="100%">
      <Flex p="2" pl="9">
        <Heading>Home</Heading>
      </Flex>
      {hash && <Heading size="5">Hash: {hash}</Heading>}
    </Flex>
  );
}
