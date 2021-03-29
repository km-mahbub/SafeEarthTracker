import { Text } from "@chakra-ui/react";
import React from "react";

interface MenuitemProps {
  children: React.ReactNode;
}

export const MenuItem: React.FC<MenuitemProps> = ({ children }) => {
  return (
    <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
      {children}
    </Text>
  );
};
