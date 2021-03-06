import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import useInterval from "../utils/useInterval.hook";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  useDisclosure,
  Text,
  Link,
} from "@chakra-ui/react";
import { Loader } from "../components/loader/Loader";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const query = gql`
  query {
    pair(id: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852") {
      token1Price
    }
    token(id: "0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba") {
      name
      symbol
      derivedETH
      tradeVolumeUSD
    }
    tokenDayDatas(
      first: 1
      orderBy: date
      orderDirection: desc
      where: { token: "0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba" }
    ) {
      dailyVolumeUSD
    }
  }
`;

const TOTAL_SUPPLY = 1000000000000000;

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [walletAddr, setWalletAddr] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formWallet, setFormWallet] = useState("");
  const [burnedToken, setBurnedToken] = useState(0.0);
  const [isBurned, setIsBurned] = useState(true);
  //const [formError, setFormError] = useState(false);
  //const [value] = React.useState("0x8DdD9bEA0C2e8b7bFd9F267e566B09d9E0F2857f");
  //const { hasCopied, onCopy } = useClipboard(value);

  const formatter12 = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    //minimumFractionDigits: 0,
    maximumFractionDigits: 12,
  });

  const formatter4 = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    //minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETH",

    //minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  });

  useInterval(() => {
    fetch(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba&address=0x000000000000000000000000000000000000dead&tag=latest&apikey=S823T3DBHWPWE1T13K3BQ1WAD1NWV39MNQ`,
      {
        method: "GET",
      }
    ).then(async (x) => {
      const burnWallet = await x.json();
      if (!parseFloat(burnWallet.result)) {
        setBurnedToken(0.0);
      } else {
        setBurnedToken(parseFloat(burnWallet.result) / 1000000000);
      }
    });
    const wallet = localStorage.getItem("wallet");
    if (wallet) {
      fetch(
        `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba&address=${wallet}&tag=latest&apikey=S823T3DBHWPWE1T13K3BQ1WAD1NWV39MNQ`,
        {
          method: "GET",
        }
      ).then(async (x) => {
        const apiWallet = await x.json();
        if (!parseFloat(apiWallet.result)) {
          setWalletBalance(0);
        } else {
          setWalletBalance(parseFloat(apiWallet.result) / 1000000000);
        }
      });
    }
  }, 30000);

  useEffect(() => {
    fetch(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba&address=0x000000000000000000000000000000000000dead&tag=latest&apikey=S823T3DBHWPWE1T13K3BQ1WAD1NWV39MNQ`,
      {
        method: "GET",
      }
    ).then(async (x) => {
      const burnWallet = await x.json();
      if (!parseFloat(burnWallet.result)) {
        setBurnedToken(0.0);
      } else {
        setBurnedToken(parseFloat(burnWallet.result) / 1000000000);
      }
    });

    const wallet = localStorage.getItem("wallet");
    if (!wallet) {
      localStorage.setItem("wallet", "");
    } else {
      setWalletAddr(wallet);
      fetch(
        `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba&address=${wallet}&tag=latest&apikey=S823T3DBHWPWE1T13K3BQ1WAD1NWV39MNQ`,
        {
          method: "GET",
        }
      ).then(async (x) => {
        const apiWallet = await x.json();
        if (!parseFloat(apiWallet.result)) {
          setWalletBalance(0);
        } else {
          setWalletBalance(parseFloat(apiWallet.result) / 1000000000);
        }
      });
    }
  }, [walletAddr]);

  const { loading, data } = useQuery(query, {
    pollInterval: 30000,
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <Center>
        <Loader loading={loading} />
      </Center>
    );
  }

  let burnBody = (
    <Stat>
      <StatLabel color="green.100">Tokens Burnt</StatLabel>
      <StatNumber onClick={() => setIsBurned(false)}>
        {burnedToken.toLocaleString("en-US")}{" "}
        <i
          className="fas fa-burn"
          style={{ color: "orange", cursor: "pointer" }}
        ></i>
      </StatNumber>
    </Stat>
  );
  if (!isBurned) {
    burnBody = (
      <Stat>
        <StatLabel color="green.100">Tokens Circulating</StatLabel>
        <StatNumber onClick={() => setIsBurned(true)}>
          {(TOTAL_SUPPLY - burnedToken).toLocaleString("en-US")}{" "}
          <i
            className="fas fa-recycle"
            style={{ color: "green", cursor: "pointer" }}
          ></i>
        </StatNumber>
      </Stat>
    );
  }

  const handleClick = () => {
    if (walletAddr) {
      localStorage.setItem("wallet", "");
      setWalletAddr("");
      setWalletBalance(0);
      setFormWallet("");
    } else {
      onOpen();
    }
  };

  const handleAddWallet = () => {
    localStorage.setItem("wallet", formWallet);
    setWalletAddr(formWallet);
    onClose();
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add SafeEarth Wallet Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Wallet Address</FormLabel>
              <Input
                value={formWallet}
                onChange={(e) => setFormWallet(e.target.value)}
                placeholder="Wallet Address"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button bg="crimson" mr={3} onClick={handleAddWallet}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box borderRadius="1px" bg="gray" w="100%" padding="0.4rem" color="white">
        <Stack spacing={4} direction="row" align="center">
          <Button size="xs" colorScheme="blue" onClick={handleClick}>
            {walletAddr ? <DeleteIcon w={4} h={4} /> : <AddIcon w={4} h={4} />}
          </Button>
          <pre>{walletAddr ? "Wallet Connected" : "No Wallet"}</pre>
        </Stack>
      </Box>
      <Container maxW="container.lg" padding="10px">
        <Container
          border="1px solid gray"
          borderRadius="1px"
          padding="0"
          marginTop="15px"
          maxW="container.md"
        >
          <Box
            borderRadius="1px"
            bg="crimson"
            w="100%"
            padding="0.4rem"
            color="white"
          >
            <strong>Wallet Data</strong>
          </Box>
          <Box padding="10px">
            <Stat>
              <StatLabel color="green.100">Total SafeEarth Balance</StatLabel>
              <StatNumber>
                {walletBalance === 0
                  ? "No Balance"
                  : walletBalance.toLocaleString("en-US")}
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel color="green.100">Total Value</StatLabel>
              <StatNumber>
                {formatter4.format(
                  data.token.derivedETH * walletBalance * data.pair.token1Price
                )}
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel color="green.100">Total Value in ETH</StatLabel>
              <StatNumber>
                {formatter.format(data.token.derivedETH * walletBalance)}
              </StatNumber>
            </Stat>

            {burnBody}
          </Box>
        </Container>
        <Container
          border="1px solid gray"
          borderRadius="1px"
          padding="0"
          marginTop="10px"
          maxW="container.md"
        >
          <Box
            borderRadius="1px"
            bg="crimson"
            w="100%"
            padding="0.4rem"
            color="white"
          >
            <strong>Market Data</strong>
          </Box>
          <Box padding="10px">
            <Stat>
              <StatLabel color="green.100">ETH/USDT</StatLabel>
              <StatNumber>
                {formatter4.format(data.pair.token1Price)}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="green.100">
                Current SafeEarth Token Price
              </StatLabel>
              <StatNumber>
                {formatter12.format(
                  data.token.derivedETH * data.pair.token1Price
                )}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="green.100">Market Cap</StatLabel>
              <StatNumber>
                {formatter4.format(
                  (TOTAL_SUPPLY - burnedToken) *
                    (data.token.derivedETH * data.pair.token1Price)
                )}
              </StatNumber>
            </Stat>
            {/* <Stat>
              <StatLabel color="green.100">Today's Volume</StatLabel>
              <StatNumber>
                {formatter4.format(data.tokenDayDatas[0].dailyVolumeUSD)}
              </StatNumber>
            </Stat> */}
          </Box>
        </Container>
        <Container
          border="1px solid gray"
          borderRadius="1px"
          padding="0"
          marginTop="10px"
          maxW="container.md"
        >
          <Box
            borderRadius="1px"
            bg="crimson"
            w="100%"
            padding="0.4rem"
            color="white"
          >
            <strong>Chart</strong>
          </Box>
          <Box padding="10px">
            <Center>
              <pre>Coming soon...</pre>
            </Center>
          </Box>
        </Container>
        <Container
          border="1px solid gray"
          borderRadius="1px"
          padding="0"
          marginTop="10px"
          maxW="container.md"
        >
          <Box
            borderRadius="1px"
            bg="black"
            w="100%"
            padding="0.4rem"
            color="white"
          >
            <SimpleGrid columns={1}>
              <Center color="crimson">
                <Text fontSize={{ base: "7px", md: "9px", lg: "12px" }}>
                  <strong>
                    <pre>
                      Copyright ?? 2021 - Made by{" "}
                      <Link
                        color="yellow"
                        href="https://t.me/iamdipto7"
                        target="_blank"
                      >
                        @Butterman
                      </Link>
                    </pre>
                  </strong>
                </Text>
              </Center>
              {/* <Center color="crimson">
                <Text fontSize={{ base: "6px", md: "9px", lg: "12px" }}>
                  <pre>
                    If you are feeling generous, feel free to donate me some
                    $SafeEarth!
                  </pre>
                </Text>
              </Center>
              <Center>
                <Text fontSize={{ base: "6px", md: "9px", lg: "12px" }}>
                  <pre>{value}</pre>
                </Text>
                <Button
                  colorScheme="teal"
                  variant="ghost"
                  onClick={onCopy}
                  ml={2}
                  size="xs"
                >
                  {hasCopied ? (
                    <Text fontSize={{ base: "6px", md: "9px", lg: "12px" }}>
                      Copied
                    </Text>
                  ) : (
                    <Text fontSize={{ base: "6px", md: "9px", lg: "12px" }}>
                      Copy
                    </Text>
                  )}
                </Button>
              </Center> */}
            </SimpleGrid>
          </Box>
        </Container>
      </Container>
    </Box>
  );
};
