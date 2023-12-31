import Image from "next/image";
import dynamic from "next/dynamic";

import { Suspense } from "react";
import {
  FooterBar,
  HeaderBar,
  HorizontalSpacer,
  Main,
  PageContent,
  Row,
  Subtitle,
  Title,
  VerticalSpacer,
} from "@/components/base";

const Communities = dynamic(() => import('@/containers/Communities'));

import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import CommunityError from "@/components/Error";
import Contribute from "@/components/Contribute";
import Head from "next/head";
import Heading from "../components/Heading";

export default function Home() {
  return (
    <Main>
      <Head>
        <title>Citizen Wallet Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content="Citizen Wallet - Community Dashboard"
        />
        <meta
          property="og:description"
          content="All the Citizen Wallet communities in one place."
        />
        <meta property="og:image" content="/logo_rounded.png" />
        <meta property="og:url" content="https://dashboard.citizenwallet.xyz" />
        <meta property="og:type" content="website" />
      </Head>
      <HeaderBar>
        <Image
          src="/logo.svg"
          alt="Citizen Wallet Logo"
          width={40}
          height={40}
          priority
        />
        <HorizontalSpacer />
        <Title>Citizen Wallet Dashboard</Title>
      </HeaderBar>
      <PageContent>
        <Heading title="Transaction Sponsors" />

        <VerticalSpacer />

        <ErrorBoundary errorComponent={CommunityError}>
          <Suspense fallback={<div>Loading...</div>}>
            <Communities />
          </Suspense>
        </ErrorBoundary>
      </PageContent>
      <FooterBar>
        <Contribute />
      </FooterBar>
    </Main>
  );
}
