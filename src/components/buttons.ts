"use client";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconButtonProps {
  size?: number;
}

export const IconButton = styled(FontAwesomeIcon)<IconButtonProps>`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  margin: 0;

  width: ${(props) => props.size || 24}px;
  height: ${(props) => props.size || 24}px;
`;
