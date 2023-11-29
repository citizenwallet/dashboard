"use client";

import Image from "next/image";
import styled from "styled-components";

export const ContributeButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: #ffffff;

  padding: 1rem;

  border-radius: 8px;

  cursor: pointer;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #eeeeee;
  }
`;

export const ContributeLogo = styled(Image)`
  height: 20px;
  width: 20px;
`;
