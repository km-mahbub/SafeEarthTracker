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
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  useDisclosure,
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

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [walletAddr, setWalletAddr] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formWallet, setFormWallet] = useState("");

  useInterval(() => {
    const wallet = localStorage.getItem("wallet");
    if (wallet) {
      fetch(
        `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba&address=${wallet}&tag=latest&apikey=S823T3DBHWPWE1T13K3BQ1WAD1NWV39MNQ`,
        {
          method: "GET",
        }
      ).then(async (x) => {
        const wallet = await x.json();
        setWalletBalance(parseFloat(wallet.result) / 1000000000);
      });
    }
  }, 30000);

  useEffect(() => {
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
        const wallet = await x.json();
        setWalletBalance(parseFloat(wallet.result) / 1000000000);
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

  const handleClick = () => {
    if (walletAddr) {
      localStorage.setItem("wallet", "");
      setWalletAddr("");
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
    <Container maxW="container.xl" pl="0" pr="0" margin="0">
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
              <StatNumber>{walletBalance.toFixed(4)}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel color="green.100">Total Value</StatLabel>
              <StatNumber>
                {(
                  data.token.derivedETH *
                  walletBalance *
                  data.pair.token1Price
                ).toFixed(4) + " USDT"}
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel color="green.100">Total Value in ETH</StatLabel>
              <StatNumber>
                {(data.token.derivedETH * walletBalance).toFixed(10) + " ETH"}
              </StatNumber>
            </Stat>
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
                {parseFloat(data.pair.token1Price).toFixed(4)}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="green.100">
                Current SafeEarth Token Price
              </StatLabel>
              <StatNumber>
                {(data.token.derivedETH * data.pair.token1Price).toFixed(12) +
                  " USDT"}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="green.100">Volume 24H</StatLabel>
              <StatNumber>
                {parseFloat(data.tokenDayDatas[0].dailyVolumeUSD).toFixed(4)}
              </StatNumber>
            </Stat>
          </Box>
        </Container>
      </Container>
    </Container>
  );
};
