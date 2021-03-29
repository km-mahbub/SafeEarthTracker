import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Drawer,
  DrawerCloseButton,
  Link,
  Heading,
  Divider,
  List,
  ListItem,
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
          <DrawerHeader borderBottomWidth="1px">🌍 SafeEarth</DrawerHeader>
          <DrawerBody>
            <Heading color="pink" as="h4" size="md">
              Buy SafeEarth
            </Heading>
            <Link
              href="https://app.uniswap.org/#/swap?outputCurrency=0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba"
              isExternal
            >
              UniSwap <ExternalLinkIcon mx="2px" />
            </Link>
            <Divider mt="5" mb="5" />
            <Heading color="pink" as="h4" size="md">
              Contact
            </Heading>
            <List spacing={3}>
              <ListItem>
                <Link href="https://t.me/safeearthcrypto" isExternal>
                  Telegram <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://twitter.com/SafeEarthETH" isExternal>
                  Twitter <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://www.reddit.com/r/Safemars" isExternal>
                  Reddit <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://discord.com/invite/Rn8ah2tkrv" isExternal>
                  Discord <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://safeearthcrypto.com" isExternal>
                  Website <ExternalLinkIcon mx="2px" />
                </Link>
              </ListItem>
            </List>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
