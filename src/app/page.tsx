import Image from "next/image";
import { Suspense } from "react";
import {
  HeaderBar,
  HorizontalSpacer,
  Main,
  PageContent,
  Row,
  Subtitle,
  Title,
  VerticalSpacer,
} from "@/components/base";

import Communities from "@/containers/Communities";

import LogoSrc from "@/assets/logo.svg";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import CommunityError from "@/components/Error";

export default function Home() {
  return (
    <Main>
      <HeaderBar>
        <Image
          src={LogoSrc}
          alt="Citizen Wallet Logo"
          width={40}
          height={40}
          priority
        />
        <HorizontalSpacer />
        <Title>Community Dashboard</Title>
      </HeaderBar>
      <PageContent>
        <Row>
          <Subtitle>Transaction Sponsors</Subtitle>
        </Row>

        <VerticalSpacer />

        <ErrorBoundary errorComponent={CommunityError}>
          <Suspense fallback={<div>Loading...</div>}>
            <Communities />
          </Suspense>
        </ErrorBoundary>
      </PageContent>
    </Main>
  );
}
