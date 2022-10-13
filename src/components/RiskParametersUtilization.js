import { getRecommendedLT, tokenName } from "../utils";

import Box from "./Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Token from "./Token";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
import riskStore from "../stores/risk.store";
import { whaleFriendlyFormater } from "./WhaleFriendly";

const currentColumns = [
  {
    name: "Asset",
    selector: (row) => row.asset,
    format: (row) => <Token value={row.asset} />,
  },
  {
    name: "Current Supply",
    selector: (row) => row.supply,
    format: (row) => whaleFriendlyFormater(row.supply),
  },
  {
    name: "Current Liquidation Threshold",
    selector: (row) => row.currentLT,
  },
  {
    name: "Recommended Liquidation Threshold",
    selector: (row) => row.recommendedLT,
  },
];

class RiskParametersUtilization extends Component {
  render() {
    const { loading } =
      poolsStore["pools_loading"] ||
      poolsStore["data/riskparams_loading"] ||
      poolsStore["tab"] == undefined;
    const collaterals = poolsStore["poolCollaterals"];
    const collateralsValue = poolsStore["collateralValues"];
    const riskParameters = poolsStore["data/riskparams_data"];

    const poolData = poolsStore["pools_data"];
    const selectedPool = poolData.find((p) => p.address === poolsStore["tab"]);
    const underlying = selectedPool["underlying"];
    const riskParametersForPool = riskParameters.find(
      (_) => _.underlying == tokenName(underlying)
    );
    const jsonTime = Math.floor(
      selectedPool["UpdateData"]["lastUpdate"] / 1000
    );
    let poolTokens = selectedPool["allowedTokens"].filter(
      (entry) =>
        collaterals.includes(tokenName(entry.tokenAddress)) &&
        entry.tokenAddress != underlying
    );
    poolTokens = poolTokens.map((e) => ({
      asset: tokenName(e.tokenAddress),
      underlying: tokenName(underlying),
      riskParameters: riskParametersForPool?.solverData,
      supply: collateralsValue[tokenName(e.tokenAddress)],
      sandboxValue:collateralsValue[tokenName(e.tokenAddress)]/1e6,
      currentLT: e.liquidationThreshold / 10000,
      simulationLT : getRecommendedLT(
        collateralsValue[tokenName(e.tokenAddress)],
        tokenName(e.tokenAddress),
        tokenName(underlying),
        riskParametersForPool?.solverData
      ),
      recommendedLT: getRecommendedLT(
        collateralsValue[tokenName(e.tokenAddress)],
        tokenName(e.tokenAddress),
        tokenName(underlying),
        riskParametersForPool?.solverData
      ),
    }));

    riskStore["currentRiskData"] = poolTokens;
    riskStore["currentRiskLoading"] = false;

    // const text = hasAtLeastOneAsterisk(utilization, "collateral_factor")
    //   ? "* if user composition will change, reduction of CF might be required to avoid bad debt."
    //   : "";
    return (
      <div>
        <Box loading={loading} time={jsonTime}>
          <hgroup>
            <h6>According to Current Usage</h6>
            <p>
              Recommended LTs according to current collateral and borrow usage.
            </p>
          </hgroup>
          {!loading && <DataTable columns={currentColumns} data={poolTokens} />}
        </Box>
      </div>
    );
  }
}

export default observer(RiskParametersUtilization);
