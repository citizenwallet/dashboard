"use client";
import Image from "next/image";
import styled from "styled-components";

export const Card = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  align-content: center;

  padding: 1rem;
  width: 100%;
  height: 100%;

  border-radius: 0.5rem;
  border: 1px solid #ccc;
  box-shadow: 0 0 0.5rem #ccc;
`;

export const CardTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;

  width: 90%;
  height: 60px;
`;

export const CommunityLogo = styled(Image)`
  width: 60px;
  height: 60px;

  background-color: #ffffff;

  border-radius: 50%;
  border: 1px solid #ccc;
`;

export const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;

  // ellipsis
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChainLogo = styled(Image)`
  position: absolute;
  top: 10px;
  left: 10px;

  width: 20px;
  height: 20px;

  background-color: #ffffff;

  border-radius: 50%;
  border: 1px solid #ccc;
`;

export const CommunityBalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;

  width: 90%;
  height: 60px;
`;

export const CommunityBalance = styled.h2`
  font-size: 1.2rem;
  font-weight: normal;
  margin: 0;
`;
