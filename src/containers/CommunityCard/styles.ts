"use client";
import styled from "styled-components";

export const Card = styled.div`
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

interface AddressContainerProps {
  copied: boolean;
}

export const AddressContainer = styled.div<AddressContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  border-radius: 0.5rem;

  padding: 0%.5rem;

  cursor: pointer;

  width: 100%;

  background-color: ${({ copied }) => (copied ? "#e2ffd1" : "transparent")};

  &:hover {
    background-color: ${({ copied }) => (copied ? "#e2ffd1" : "#eee")};
  }

  transition: background-color 0.25s ease-in-out;
`;
