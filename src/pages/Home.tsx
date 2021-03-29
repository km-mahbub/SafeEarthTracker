import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import useInterval from "../utils/useInterval.hook";
import { Box, Container } from "@chakra-ui/react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0.0);

  useInterval(() => {
    fetch(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba&address=0x1940Ae4af4270e64EB541ef60edB94a85a0C35b6&tag=latest&apikey=S823T3DBHWPWE1T13K3BQ1WAD1NWV39MNQ`,
      {
        method: "GET",
      }
    ).then(async (x) => {
      const wallet = await x.json();
      setWalletBalance(parseFloat(wallet.result) / 1000000000);
      setIsLoading(false);
    });
  }, 60000);

  useEffect(() => {
    fetch(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xe6f1966d04cfcb9cd1b1dc4e8256d8b501b11cba&address=0x1940Ae4af4270e64EB541ef60edB94a85a0C35b6&tag=latest&apikey=S823T3DBHWPWE1T13K3BQ1WAD1NWV39MNQ`,
      {
        method: "GET",
      }
    ).then(async (x) => {
      const wallet = await x.json();
      setWalletBalance(parseFloat(wallet.result) / 1000000000);
      setIsLoading(false);
    });
  }, []);

  const { loading, data } = useQuery(query, {
    pollInterval: 60000,
    fetchPolicy: "network-only",
  });

  if (loading || isLoading) return <p>Loading...</p>;

  return (
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
          <p>
            <strong>Total SafeEarth Balance: </strong>{" "}
            {walletBalance.toFixed(4)}
          </p>
          <p>
            <strong>Total Value: </strong>{" "}
            {(
              data.token.derivedETH *
              walletBalance *
              data.pair.token1Price
            ).toFixed(4) + " USDT"}
          </p>
          <p>
            <strong>Total Value in ETH: </strong>{" "}
            {(data.token.derivedETH * walletBalance).toFixed(4) + " ETH"}
          </p>
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
          <p>
            <strong>ETH/USDT: </strong>{" "}
            {parseFloat(data.pair.token1Price).toFixed(4)}
          </p>
          <p>
            <strong>Current SafeEarth Price: </strong>{" "}
            {(data.token.derivedETH * data.pair.token1Price).toFixed(12) +
              " USDT"}
          </p>
          <p>
            <strong>Volume 24H: </strong>{" "}
            {parseFloat(data.tokenDayDatas[0].dailyVolumeUSD).toFixed(4)}
          </p>
        </Box>
      </Container>
    </Container>
  );
};
