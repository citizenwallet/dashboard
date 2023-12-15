"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

interface ActiveProps {
  $active: boolean;
}

export const AddressContainer = styled.div<ActiveProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  border-radius: 0.5rem;

  padding: 0%.5rem;

  cursor: pointer;

  max-width: 100%;

  background-color: ${({ $active }) => ($active ? "#e2ffd1" : "transparent")};

  &:hover {
    background-color: ${({ $active }) => ($active ? "#e2ffd1" : "#eee")};
  }

  transition: background-color 0.25s ease-in-out;
`;

export const AddressText = styled.p<ActiveProps>`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;

  color: ${({ $active }) => ($active ? "#191919" : "#0d0d0d")};

  transition: color 0.25s ease-in-out;

  // ellipsis
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ArrowUpIcon = styled(FontAwesomeIcon)<ActiveProps>`
  height: 16px;
  width: 16px;

  margin-left: 0.5rem;
  cursor: pointer;

  color: ${({ $active }) => ($active ? "#191919" : "#0d0d0d")};

  transition: color 0.25s ease-in-out;
`;
