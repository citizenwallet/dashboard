"use client";

import Link from "next/link";
import { Flex, Text } from "@radix-ui/themes";
import { CSSProperties } from "react";

export interface Tab {
  href: string;
  item: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabProps {
  pathname: string;
  tabs: Tab[];
}

const inactiveStyle: CSSProperties = {
  textDecoration: "none",
  color: "unset",
};

const activeStyle: CSSProperties = {
  textDecoration: "none",
  color: "unset",
};

export default function Tabs({ pathname, tabs = [] }: TabProps) {
  if (tabs.length === 0) return null;

  return (
    <Flex direction="column">
      {tabs.map(({ href, label, icon }) => {
        const isActive = pathname === href.replace(/\/$/, ""); // remove trailing slash
        return (
          <Link
            key={href}
            href={href}
            style={isActive ? activeStyle : inactiveStyle}
            className={
              isActive ? "bg-muted rounded-sm" : "hover:bg-muted rounded-sm"
            }
          >
            <Flex align="center" justify="between" py="1" px="2">
              <Text weight={isActive ? "bold" : "regular"}>{label}</Text>
              {icon}
            </Flex>
          </Link>
        );
      })}
    </Flex>
  );
}
