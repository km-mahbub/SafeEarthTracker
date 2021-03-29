import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

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

  const { loading, data } = useQuery(query);

  if (loading || isLoading) return <p>Loading...</p>;

  return (
    <div>
      <fieldset>
        <legend>Wallet Data:</legend>
        <p>
          <strong>Total SafeEarth Balance: </strong> {walletBalance.toFixed(4)}
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
      </fieldset>

      <fieldset>
        <legend>Market Data:</legend>
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
      </fieldset>
    </div>
  );
};
