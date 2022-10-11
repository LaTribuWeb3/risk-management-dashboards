import Box from "./Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Token from "./Token";
import { hasAtLeastOneAsterisk } from "./Asterisk";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
import { tokenName } from "../utils";
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
    const { loading } = poolsStore["pools_loading"];

    const collaterals = poolsStore["poolCollaterals"];
    const collateralsValue = poolsStore["collateralValues"];
    let utilization = [];
    let poolTokens = poolsStore["pools_data"];
    poolTokens = poolTokens.find((p) => p.address === poolsStore["tab"]);
    const jsonTime = Math.floor(poolTokens["UpdateData"]["lastUpdate"]/1000);
    poolTokens = poolTokens["allowedTokens"];
    poolTokens = poolTokens.filter((entry) =>
      collaterals.includes(tokenName(entry.tokenAddress))
    );
    poolTokens = poolTokens.map((e) => ({
      asset: tokenName(e.tokenAddress),
      supply: collateralsValue[tokenName(e.tokenAddress)],
      currentLT: e.liquidationThreshold / 10000,
      recommendedLT: e.recommendedLiquidationThreshold / 10000,
    }));

    const text = hasAtLeastOneAsterisk(utilization, "collateral_factor")
      ? "* if user composition will change, reduction of CF might be required to avoid bad debt."
      : "";
    return (
      <div>
        <Box loading={loading} time={jsonTime} text={text}>
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
