import { Component } from "react";
import { observer } from "mobx-react";
import Box from "../components/Box";
import SlippageChart from "../components/SlippageChart";
import poolsStore from "../stores/pools.store";

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
    const loading = poolsStore["dex_liquidity_loading"];
    const collaterals = poolsStore["poolCollaterals"];
    let symbol = poolsStore["activeTabSymbol"];
    if (symbol.toLowerCase() == "wsteth") {
      symbol = "stETH";
    }
    let liquidity_data = poolsStore[symbol.toLowerCase() + "_liquidity_data"];
    delete liquidity_data.json_time;
    liquidity_data = Object.entries(liquidity_data);
    let liquidityArray = [];
    liquidity_data.forEach((entry) => {
      liquidityArray.push({
        name: entry[0],
        value: entry[1][symbol]["volume"],
      });
    });

    // filter out collaterals not present in pool
    liquidityArray = liquidityArray.filter((entry) =>
      collaterals.includes(entry.name)
    );
    return (
      <div>
        <Box loading={loading}>
          <details open>
            <summary>
              <span>{symbol}</span>
            </summary>
            <div style={{ display: "flex" }}>
              <SlippageChart symbol={symbol} data={liquidityArray} />
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
