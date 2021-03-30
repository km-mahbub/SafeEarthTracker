import { Flex } from "@chakra-ui/layout";
import React from "react";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <Flex minHeight="100vh" flexDirection="column">
      Footer
    </Flex>
  );
};
