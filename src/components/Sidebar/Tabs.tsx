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

  console.log("pathname", pathname);

  if (tabs.length === 0) return null;

  return tabs.map(({ href, label, icon }) => {
    const isActive = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        style={isActive ? activeStyle : inactiveStyle}
      >
        <Flex align="center" justify="between" px="1">
          <Text>{label}</Text>
          {icon}
        </Flex>
      </Link>
    );
  });
}
