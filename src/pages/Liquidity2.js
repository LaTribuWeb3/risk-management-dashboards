import Box from "../components/Box";
import { Component } from "react";
import SlippageChart from "../components/SlippageChart";
import { observer } from "mobx-react";
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
    const loading = poolsStore["liquidity_loading"];
    const collaterals = poolsStore["poolCollaterals"];
    const rawData = Object.assign([], poolsStore["liquidity_data"] || {});
    let symbol = poolsStore["activeTabSymbol"];
    const jsonTime = rawData[0]["slippage"]["json_time"];

    let liquidity_data = rawData;

    for (let i = 0; i < liquidity_data.length; i++) {
      if (liquidity_data[i]["debtToken"] === symbol) {
        liquidity_data = liquidity_data[i]["slippage"];
      }
    }

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
    const riskData = Object.assign({}, poolsStore["risk_data"] || {});
    for (let i = 0; i < liquidityArray.length; i++) {
      for (const entry in riskData) {
        if (riskData[entry]["underlying"] === symbol) {
          if (
            riskData[entry]["current"][liquidityArray[i].name] !== undefined
          ) {
            liquidityArray[i]["liquidation"] =
              riskData[entry]["current"][liquidityArray[i].name][
                "total_liquidation"
              ];
          } else {
            liquidityArray[i]["liquidation"] = "Not Found";
          }
        }
      }
    }
    liquidityArray.sort(
      (a, b) => b.liquidation / b.value - a.liquidation / a.value
    );

    return (
      <div>
        <Box loading={loading} time={jsonTime}>
          <p></p>
          {liquidityArray.map((asset, i) => (
            <details key={i} open>
              <summary>{asset.name}</summary>
              <div style={{ display: "flex" }}>
                <SlippageChart data={asset} i={i} />
              </div>
            </details>
          ))}
        </Box>
      </div>
    );
  }
}

export default observer(Liquidity);
