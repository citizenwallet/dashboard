"use client";

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
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  height: 60px;
  width: 100%;

  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin: 0;
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
