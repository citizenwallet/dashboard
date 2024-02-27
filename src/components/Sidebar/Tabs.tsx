"use client";

import Link from "next/link";
import { Flex, Text } from "@radix-ui/themes";
import { usePathname } from "next/navigation";
import { CSSProperties } from "react";

export interface Tab {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabProps {
  tabs: Tab[];
}

const inactiveStyle: CSSProperties = {
  textDecoration: "none",
  color: "unset",
};

const activeStyle: CSSProperties = {
  textDecoration: "none",
  color: "unset",
  fontWeight: "bold",
};

export default function Tabs({ tabs = [] }: TabProps) {
  const pathname = usePathname();

  if (tabs.length === 0) return null;

  return (
    <Flex direction="column">
      {tabs.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={isActive ? activeStyle : inactiveStyle}
            className="hover:bg-muted rounded-sm"
          >
            <Flex align="center" justify="between" py="1" px="2">
              <Text>{label}</Text>
              {icon}
            </Flex>
          </Link>
        );
      })}
    </Flex>
  );
}
