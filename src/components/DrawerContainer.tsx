import {
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Drawer,
  DrawerCloseButton,
} from "@chakra-ui/react";
import React from "react";

interface DrawerContainerProps {
  isOpen: boolean;
  onClose: any;
}

export const DrawerContainer: React.FC<DrawerContainerProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Drawer onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">SafeEarth</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
