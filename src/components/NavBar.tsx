import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { DrawerContainer } from "./DrawerContainer";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="2rem"
      bg="black"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
          🌍 SafeEarth Tracker
        </Heading>
      </Flex>

      <Box
        cursor="pointer"
        display={{ base: "block", md: "block" }}
        onClick={onOpen}
      >
        <svg
          fill="white"
          width="20px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>
      <DrawerContainer isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Navbar;
