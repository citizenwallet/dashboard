"use client";

import Image from "next/image";
import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  min-height: 100vh;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  width: 100%;
`;

export const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;

  z-index: 9999;

  background-color: #ffffff;

  padding: 1rem;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  height: 60px;
  width: 100%;

  margin-bottom: 1rem;
`;

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  padding-top: 60px;
  padding-bottom: 60px;

  width: 90%;
  max-width: 1200px;
`;

export const FooterBar = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;

  z-index: 9999;

  padding: 1rem;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  height: 60px;
  width: 100%;

  margin-top: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.5cqw;
  font-weight: 500;
  margin: 0;

  // ellipsis
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  // at 1200px
  @media (max-width: 1200px) {
    font-size: 3cqw;
  }

  // at 900px
  @media (max-width: 900px) {
    font-size: 5cqw;
  }

  // at 600px
  @media (max-width: 600px) {
    font-size: 6cqw;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
`;

export const HorizontalSpacer = styled.div`
  width: 1rem;
`;

export const VerticalSpacer = styled.div`
  height: 1rem;
`;
