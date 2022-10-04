import React, { Component } from "react";
import { observer } from "mobx-react";
import Box from "../components/Box";
import SlippageChart from "../components/SlippageChart";
import DataTable from "react-data-table-component";
import mainStore from "../stores/main.store";
import { whaleFriendlyFormater } from "../components/WhaleFriendly";
import { precentFormatter } from "../utils";
import Token from "../components/Token";
import TopAccounts, { usersMinWidth } from "../components/TopAccounts";
import poolsStore from "../stores/pools.store";
import BigNumber from "bignumber.js";

// const columns = [
//   {
//     name: "LP Pair",
//     selector: (row) => row.key,
//     format: (row) => <Token value={row.key} />,
//     minWidth: "140px",
//   },
//   {
//     name: "LPs count",
//     selector: (row) => row.count,
//     format: (row) => row.count,
//   },
//   {
//     name: "Avg LP size",
//     selector: (row) => row.avg,
//     format: (row) => whaleFriendlyFormater(row.avg),
//   },
//   {
//     name: "Med LP size",
//     selector: (row) => row.med,
//     format: (row) => whaleFriendlyFormater(row.med),
//   },
//   {
//     name: "Top 1 LP",
//     selector: (row) => row.top_1,
//     format: (row) => precentFormatter(row.top_1),
//   },
//   {
//     name: "Top 5 LP",
//     selector: (row) => row.top_5,
//     format: (row) => <TopAccounts row={row} />,
//     minWidth: usersMinWidth,
//   },
//   {
//     name: "Top 10 LP",
//     selector: (row) => row.top_10,
//     format: (row) => precentFormatter(row.top_10),
//   },
//   {
//     name: "Total liquidity ",
//     selector: (row) => row.total,
//     format: (row) => whaleFriendlyFormater(row.total),
//   },
// ];

class Liquidity extends Component {
  render() {
    return (
      <div>
        <Box loading={poolsStore["dex_liquidity_loading"]}>
          <details open>
            <summary>
              <span>{poolsStore["activeTabSymbol"]}</span>
            </summary>
            <div style={{ display: "flex" }}>
              <SlippageChart
                symbol={poolsStore["activeTabSymbol"]}
                data={poolsStore["liquidityData"]}
              />
            </div>
            {/* <div style={{ marginLeft: "30px" }}>
                {!!asset.lps.length && (
                  <Box>
                    <DataTable columns={columns} data={asset.lps} />
                  </Box>
                )}
              </div> */}
          </details>
        </Box>
      </div>
    );
  }
}

export default observer(Liquidity);
