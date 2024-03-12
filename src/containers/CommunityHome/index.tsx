"use client";

import { Config } from "@citizenwallet/sdk";
import CommunityHomeTemplate from "@/templates/CommunityHome";
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

export default function Container({
  community: { community },
}: {
  community: Config;
}) {
  return (
    <CommunityHomeTemplate
      CommunityCard={
        <Card className="max-w-screen-sm min-w-screen-sm">
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
      }
    />
  );
}
