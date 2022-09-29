import { TOKEN_PREFIX } from "./constants";
import React from "react";
import poolsStore from "./stores/pools.store";
import { relativeTimeRounding } from "moment";

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

const tokenData = Object.assign(
  [],
  poolsStore["data/tokens?fakeMainnet=0_data"] || []
);
export const tokenName = (address) => {
  for (const token in tokenData) {
    if (tokenData[token].address.toLowerCase() === address.toLowerCase()) {
      return tokenData[token].symbol;
    }
  }
};
