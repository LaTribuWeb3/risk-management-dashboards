import { TOKEN_PREFIX } from "./constants";
import React from "react";
import poolsStore from "./stores/pools.store";
import { relativeTimeRounding } from "moment";
import BigNumber from "bignumber.js";

function roundTo(num, dec) {
  const pow = Math.pow(10, dec);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}

export const removeTokenPrefix = (token) => token.replace(TOKEN_PREFIX, "");

export const precentFormatter = (num) => {
  if (isNaN(num)) {
    // not a numerical string
    return num;
  } else {
    num = parseFloat(num);
  }
  return (num * 100).toFixed(2) + "%";
};

export const tokenName = (address) => {
  const tokenData = Object.assign(
    [],
    poolsStore["data/tokens?fakeMainnet=0_data"] || []
  );
  for (const token in tokenData) {
    if (tokenData[token].address.toLowerCase() === address.toLowerCase()) {
      return tokenData[token].symbol;
    }
  }
};

export const tokenPrice = (symbol, amount) => {
  if (amount == 0) {
    return 0;
  }
  const tokenData = Object.assign(
    [],
    poolsStore["data/tokens?fakeMainnet=0_data"] || []
  );
  for (const token in tokenData) {
    if (tokenData[token].symbol.toLowerCase() === symbol.toLowerCase()) {
      const tokenPrice = BigNumber(tokenData[token].priceUSD18Decimals).div(
        BigNumber(10).pow(18)
      );
      const tokenDecimals = tokenData[token].decimals;
      const tokenAmount = BigNumber(amount).div(
        BigNumber(10).pow(tokenDecimals)
      );
      const result = roundTo(
        Number(BigNumber(tokenPrice).multipliedBy(BigNumber(tokenAmount))),
        2
      );
      return result.toString();
    }
  }
};
