import Box from "../components/Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
import { whaleFriendlyFormater } from "../components/WhaleFriendly";

const Columns = [
  {
    name: "Asset",
    selector: (row) => row.asset,
    format: (row) => row.asset,
    sortable: true,
  },
  {
    name: "Liquidity",
    selector: (row) => row.liquidity,
    format: (row) => whaleFriendlyFormater(Number(row.liquidity).toFixed(2)),
    sortable: true,
  },
  {
    name: "Backing Ratio",
    selector: (row) => row.ratio,
    format: (row) => row.ratio,
    sortable: true,
  },
];

class StableMonitoring extends Component {
  render() {
    const { loading } = poolsStore["liquidity_loading"];
    const { json_time } = mainStore["risk_params_data"] || {};

    const stables = ["LUSD", "sUSD", "USDT", "FRAX", "DAI", "USDC"];
    const rawData = Object.assign([], poolsStore["liquidity_data"] || {});
    const tab = poolsStore["activeTabSymbol"];

    const ratioData = [];

    if (!loading) {
      let liquidityData = rawData;
      for (let i = 0; i < liquidityData.length; i++) {
        if (liquidityData[i]["debtToken"] === tab) {
          liquidityData = liquidityData[i]["slippage"];
          break;
        }
      }
      for (let i = 0; i < stables.length; i++) {
        for (const entry in liquidityData) {
          if (entry == stables[i]) {
            ratioData.push({
              asset: entry,
              liquidity: liquidityData[entry][tab]["volume"],
              ratio: liquidityData[entry][tab]["ratio"] ? Number((liquidityData[entry][tab]["ratio"])*100).toFixed(2) + " %" : "N/A",
            });
          }
        }
      }
    }

    return (
      <div>
        <Box loading={loading} time={json_time}>
          {!loading && (
            <DataTable
              defaultSortFieldId={2}
              columns={Columns}
              data={ratioData}
            />
          )}
        </Box>
      </div>
    );
  }
}

export default observer(StableMonitoring);
