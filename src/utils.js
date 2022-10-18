import BigNumber from "bignumber.js";
import { TOKEN_PREFIX } from "./constants";
import poolsStore from "./stores/pools.store";

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
    poolsStore["tokens_data"] || []
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
    poolsStore["tokens_data"] || []
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

export const getRecommendedLT = (
  collateralValue,
  collateralName,
  underlyingName,
  riskParameters
) => {
  if (riskParameters == null) {
    return "No Pool Data";
  }

  const Lfs = [1, 1.5, 2];

  /// select token data for tName
  let tokenRiskData = riskParameters[collateralName + "-" + underlyingName];
  if (tokenRiskData == undefined) {
    console.log(
      "cannot find token -- " + collateralName + " -- in risk parameters"
    );
    return "Not Found";
  }

  // rearrange data
  tokenRiskData = Object.values(tokenRiskData)[0];
  const formattedData = [];
  tokenRiskData.forEach((t) => {
    const fData = formattedData.find((f) => f.dc == t.dc);
    if (fData == undefined) {
      formattedData.push({
        dc: t.dc,
        values: [
          {
            lf: t.lf,
            md: t.md,
            li: t.li,
          },
        ],
      });
    } else {
      fData.values.push({
        lf: t.lf,
        md: t.md,
        li: t.li,
      });
    }
  });
  formattedData.sort((a, b) => a.dc - b.dc);

  // find closest DC value to collateralValue
  const collateralInMillions = collateralValue / 1e6;
  let selectedFData = formattedData[0];
  for (let i = 1; i < formattedData.length; i++) {
    const fData = formattedData[i];
    if (fData.dc < collateralInMillions) {
      selectedFData = fData;
    } else {
      const distanceFromFData = collateralInMillions - fData.dc;
      const distanceFromPrevious = collateralInMillions - selectedFData.dc;
      if (distanceFromFData < distanceFromPrevious) {
        selectedFData = fData;
      }
      break;
    }
  }

  // compute recommended LT
  let meanMD = selectedFData.values
    .filter((_) => Lfs.includes(_.lf))
    .map((_) => _.md);
  meanMD = meanMD.reduce((a, b) => a + b, 0) / meanMD.length;
  let meanLI = selectedFData.values
    .filter((_) => Lfs.includes(_.lf))
    .map((_) => _.li);
  meanLI = meanLI.reduce((a, b) => a + b, 0) / meanLI.length;
  return 1 - meanMD - meanLI;
};

export const initialSandboxValue = (
  token,
  underlying,
  riskParameters,
  value
) => {
  let tokenRiskData = riskParameters[token + "-" + underlying];
  if (tokenRiskData == undefined) {
    console.log("cannot find token -- " + token + " -- in risk parameters");
    return 0;
  }

  // rearrange data
  tokenRiskData = Object.values(tokenRiskData)[0];
  const formattedData = [];
  tokenRiskData.forEach((t) => {
    const fData = formattedData.find((f) => f.dc == t.dc);
    if (fData == undefined) {
      formattedData.push({
        dc: t.dc,
        values: [
          {
            lf: t.lf,
            md: t.md,
            li: t.li,
          },
        ],
      });
    } else {
      fData.values.push({
        lf: t.lf,
        md: t.md,
        li: t.li,
      });
    }
  });
  formattedData.sort((a, b) => a.dc - b.dc);

  // find closest DC value to collateralValue
  const collateralInMillions = value;
  let selectedFData = formattedData[0];
  for (let i = 1; i < formattedData.length; i++) {
    const fData = formattedData[i];
    if (fData.dc < collateralInMillions) {
      selectedFData = fData;
    } else {
      const distanceFromFData = collateralInMillions - fData.dc;
      const distanceFromPrevious = collateralInMillions - selectedFData.dc;
      if (distanceFromFData < distanceFromPrevious) {
        selectedFData = fData;
      }
      break;
    }
  }
  const index = formattedData.map((e) => e.dc).indexOf(selectedFData.dc);

  return formattedData[index].dc;
};

export const sandboxSwitch = (row, field, up) => {
  let tokenRiskData = row.riskParameters[row.asset + "-" + row.underlying];
  if (tokenRiskData == undefined) {
    console.log("cannot find token -- " + row.asset + " -- in risk parameters");
    return "Not Found";
  }

  // rearrange data
  tokenRiskData = Object.values(tokenRiskData)[0];
  const formattedData = [];
  tokenRiskData.forEach((t) => {
    const fData = formattedData.find((f) => f.dc == t.dc);
    if (fData == undefined) {
      formattedData.push({
        dc: t.dc,
        values: [
          {
            lf: t.lf,
            md: t.md,
            li: t.li,
          },
        ],
      });
    } else {
      fData.values.push({
        lf: t.lf,
        md: t.md,
        li: t.li,
      });
    }
  });
  formattedData.sort((a, b) => a.dc - b.dc);

  // find closest DC value to collateralValue
  const collateralInMillions = row.sandboxValue;
  let selectedFData = formattedData[0];
  for (let i = 1; i < formattedData.length; i++) {
    const fData = formattedData[i];
    if (fData.dc < collateralInMillions) {
      selectedFData = fData;
    } else {
      const distanceFromFData = collateralInMillions - fData.dc;
      const distanceFromPrevious = collateralInMillions - selectedFData.dc;
      if (distanceFromFData < distanceFromPrevious) {
        selectedFData = fData;
      }
      break;
    }
  }
  const index = formattedData.map((e) => e.dc).indexOf(selectedFData.dc);
console.log()
  if (up == "1") {
    if (formattedData[index + 1] == undefined) {
      console.log("out of the simulation bounds");
    } else {
      row["sandboxValue"] = formattedData[index + 1].dc;
      row["simulationLT"] = getRecommendedLT(formattedData[index + 1].dc, row.asset, row.underlying, row.riskParameters);
    }
  } else if (up == 0) {
    if (formattedData[index - 1] == undefined) {
      console.log("out of the simulation bounds");
    } else {
      row["sandboxValue"] = formattedData[index - 1].dc;
      row["simulationLT"] = getRecommendedLT(formattedData[index - 1].dc, row.asset, row.underlying, row.riskParameters);
    }
  } else {
    console.log("error");
  }
};
