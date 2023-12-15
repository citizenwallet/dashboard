"use client";

import { HorizontalSpacer, Row, Subtitle } from "@/components/base";
import { IconButton } from "@/components/buttons";
import { FC } from "react";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/navigation";

interface HeadingProps {
  title: string;
}

const Heading: FC<HeadingProps> = ({ title }) => {
  const router = useRouter();

  const handleReload = () => {
    router.refresh();
  };

  return (
    <Row>
      <Subtitle>{title}</Subtitle>
      <HorizontalSpacer />
      <IconButton onClick={handleReload} icon={faRefresh} />
    </Row>
  );
};

export default Heading;
