import {
  getRecommendedLT,
  initialSandboxValue,
  tableStyle,
  tokenName,
} from "../utils";

import Box from "./Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Ramzor from "./Ramzor";
import Token from "./Token";
import alertStore from "../stores/alert.store";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
import riskStore from "../stores/risk.store";
import { whaleFriendlyFormater } from "./WhaleFriendly";

const currentLT = (currentLT, recommendedLT) => {
  const alert = currentLT > recommendedLT;
  return <Ramzor red={alert}>{currentLT}</Ramzor>;
};
const currentColumns = [
  {
    name: "Asset",
    selector: (row) => row.asset,
    format: (row) => <Token value={row.asset} />,
    sortable: true,
  },
  {
    name: "Current Supply",
    selector: (row) => row.supply,
    format: (row) => whaleFriendlyFormater(row.supply),
    sortable: true,
  },
  {
    name: "Current Liquidation Threshold",
    selector: (row) => currentLT(row.currentLT, row.recommendedLT),
    sortable: true,
  },
  {
    name: "Recommended Liquidation Threshold",
    selector: (row) => row.recommendedLT,
    sortable: true,
  },
];

class RiskParametersUtilization extends Component {
  render() {
    const { loading } =
      poolsStore["pools_loading"] ||
      poolsStore["risk_loading"] ||
      !poolsStore["tab"];
    const collaterals = poolsStore["poolCollaterals"];
    const collateralsValue = poolsStore["collateralValues"];
    const riskParameters = poolsStore["risk_data"];

    const poolData = poolsStore["pools_data"];
    const selectedPool = poolData.find((p) => p.address === poolsStore["tab"]);
    const underlying = selectedPool["underlying"];
    const riskParametersForPool = riskParameters.find(
      (_) => _.underlying === tokenName(underlying)
    );
    const jsonTime = Math.floor(
      selectedPool["UpdateData"]["lastUpdate"] / 1000
    );
    let poolTokens = selectedPool["allowedTokens"].filter(
      (entry) =>
        collaterals.includes(tokenName(entry.tokenAddress)) &&
        entry.tokenAddress !== underlying
    );
    poolTokens = poolTokens.map((e) => ({
      asset: tokenName(e.tokenAddress),
      underlying: tokenName(underlying),
      riskParameters: riskParametersForPool?.risk,
      supply: collateralsValue[tokenName(e.tokenAddress)],
      sandboxValue: initialSandboxValue(
        tokenName(e.tokenAddress),
        tokenName(underlying),
        riskParametersForPool?.risk,
        collateralsValue[tokenName(e.tokenAddress)] / 1e6
      ),
      currentLT: e.liquidationThreshold / 10000,
      simulationLT: getRecommendedLT(
        collateralsValue[tokenName(e.tokenAddress)],
        tokenName(e.tokenAddress),
        tokenName(underlying),
        riskParametersForPool?.risk
      ),
      recommendedLT: getRecommendedLT(
        collateralsValue[tokenName(e.tokenAddress)],
        tokenName(e.tokenAddress),
        tokenName(underlying),
        riskParametersForPool?.risk
      ),
    }));
    // sort by supply
    poolTokens.sort((a, b) => b.supply - a.supply);
    riskStore["currentRiskData"] = poolTokens;
    riskStore["currentRiskLoading"] = false;

    // get threshold alerts
    const collateralAlerts = [];
    for (let i = 0; i < poolTokens.length; i++) {
      if (poolTokens[i].currentLT > poolTokens[i].recommendedLT) {
        const currentLT = poolTokens[i].currentLT;
        collateralAlerts.push({
          asset: poolTokens[i].asset,
          currentLT,
          recommendedCF: poolTokens[i].recommendedLT,
          basedOn: "caps",
        });
      }
    }
    const type = collateralAlerts.length ? "review" : "healthy";
    alertStore["collateralAlerts"] = {
      title: "Liquidation Thresholds",
      data: collateralAlerts,
      type,
      link: "#collateral-factors",
    };
    alertStore["collateralAlerts_loading"] = false;

    // const text = hasAtLeastOneAsterisk(utilization, "collateral_factor")
    //   ? "* if user composition will change, reduction of CF might be required to avoid bad debt."
    //   : "";
    return (
      <div>
        <Box loading={loading} time={jsonTime}>
          <hgroup>
            <h6>According to Current Usage</h6>
            <p>
              Recommended LTs according to current positional value and borrow usage.
            </p>
          </hgroup>
          {!loading && (
            <DataTable
              columns={currentColumns}
              data={poolTokens}
              defaultSortFieldId={2}
              defaultSortAsc={false}
              customStyles={tableStyle}
              dense
            />
          )}
        </Box>
      </div>
    );
  }
}

export default observer(RiskParametersUtilization);
