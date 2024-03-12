"use client";

import { Config } from "@citizenwallet/sdk";
import PickCommunityTemplate from "@/templates/PickCommunity";
import { Grid } from "@radix-ui/themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Container({ communities }: { communities: Config[] }) {
  const router = useRouter();

  const handlePickCommunity = (slug: string) => {
    router.push(`/admin/${slug}/`);
  };
  return (
    <PickCommunityTemplate
      Picker={
        <Grid
          display="grid"
          columns={{ initial: "1", sm: "2", md: "3" }}
          gap="3"
          width="auto"
        >
          {communities.map(({ community }) => (
            <Card
              key={community.alias}
              className="max-w-screen-sm cursor-pointer"
              onClick={() => handlePickCommunity(community.alias)}
            >
              <CardHeader>
                <CardTitle className="flex flex-row items-center">
                  <Image
                    src={community.logo}
                    alt="community logo"
                    height={40}
                    width={40}
                  />
                  {community.name}
                </CardTitle>
                <CardDescription>{community.description}</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          ))}
        </Grid>
      }
    />
  );
}
