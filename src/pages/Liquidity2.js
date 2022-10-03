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
    const loading = mainStore["dex_liquidity_loading"];
    const rawData = Object.assign([], mainStore["dex_liquidity_data"] || []);
    const symbol = poolsStore['activeTabSymbol'];
    const tokenData = Object.assign(
      [],
      poolsStore["data/tokens?fakeMainnet=0_data"] || []
    );
    let filteredData = rawData.filter((pair) => 
      pair.symbolOut == symbol
    )
    const formattedData = filteredData.map((pair, i) => {
      let price = tokenData.filter((tk => tk.symbol == symbol))[0]["priceUSD18Decimals"];
      price = BigNumber(price).div(BigNumber(10).pow(18));
      let liquidity = BigNumber(pair.normalizedLiquidity).multipliedBy(BigNumber(price));
      liquidity = Math.floor(Number(liquidity));
      return {
        name: pair.symbolIn,
        value: liquidity,
      }
    })

    return (
      <div>
        <Box loading={loading}>
            <details open>
              <summary>
                <span>{symbol}</span>
              </summary>
              <div style={{ display: "flex" }}>
                <SlippageChart symbol={symbol} data={formattedData} />
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
