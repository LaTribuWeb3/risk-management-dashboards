import Box from "../components/Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Ramzor from "../components/Ramzor";
import Token from "../components/Token";
import alertStore from "../stores/alert.store";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
import { tableStyle } from "../utils";

const percentFrom = (base, num) => {
  if (base <= 0 || num <= 0) {
    return "NA";
  }
  const percent = (num / base) * 100 - 100;
  return (
    <Ramzor
      yellow={percent > 2 || percent < -2}
      red={percent > 5 || percent < -5}
    >
      {percent.toFixed(2)}%
    </Ramzor>
  );
};

const columns = [
  {
    name: "Asset",
    selector: (row) => row.key,
    format: (row) => <Token value={row.key} />,
    sortable: true,
  },
  {
    name: "Platform’s Oracle Price ($)",
    selector: (row) => row.oracle,
    sortable: true,
  },
  {
    name: "CEX Price",
    selector: (row) => row.cex_price,
    format: (row) => percentFrom(row.oracle, row.cex_price),
    sortable: true,
  },
  {
    name: "DEX Price",
    selector: (row) => row.dex_price,
    format: (row) => percentFrom(row.oracle, row.dex_price),
    sortable: true,
  },
];

function roundTo(num, dec) {
  const pow = Math.pow(10, dec);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}

class Oracles extends Component {
  render() {
    const loading = poolsStore["tokens_loading"];
    const collaterals = poolsStore["poolCollaterals"];
    let oracleData = Object.assign([], poolsStore["tokens_data"] || []);
    const jsonTime = Math.floor(
      oracleData["0"]["updateData"]["lastUpdate"] / 1000
    );
    let oracleArray = [];
    oracleData.forEach((entry) => {
      oracleArray.push({
        key: entry.symbol,
        oracle: roundTo(entry.priceUSD18Decimals / 1e18, 4),
        cex_price: roundTo(entry.cexPriceUSD18Decimals / 1e18, 4),
        dex_price: roundTo(entry.dexPriceUSD18Decimals / 1e18, 4),
      });
    });

    // filter out collaterals not present in pool
    oracleArray = oracleArray.filter((entry) =>
      collaterals.includes(entry.key)
    );

    /// compute oracle alerts
    const priceOracleDiffThreshold = 5;
    const alertArray = [];

    const percentFromDiff = (base, num) => {
      const diff = (num / base) * 100 - 100;
      return Math.abs(diff);
    };
    for (let i = 0; i < oracleArray.length; i++) {
      if (
        oracleArray[i].oracle &&
        oracleArray[i].cex_price &&
        oracleArray[i].dex_price > 0
      ) {
        const diff = Math.max(
          percentFromDiff(oracleArray[i].oracle, oracleArray[i].cex_price),
          percentFromDiff(oracleArray[i].oracle, oracleArray[i].dex_price)
        );
        if (diff >= priceOracleDiffThreshold) {
          alertArray.push({
            asset: oracleArray[i].key,
            diff,
          });
        }
      }
    }
    alertArray.filter((r) => !!r);
    const type = alertArray.length ? "review" : "healthy";
    alertStore["oracleDeviation"] = {
      title: "oracles",
      data: [],
      type,
      link: "#oracle-deviation",
    };
    alertStore["oracleDeviation_loading"] = false;

    return (
      <div>
        <Box loading={loading} time={jsonTime}>
          {!loading && <DataTable customStyles={tableStyle}
              dense columns={columns} data={oracleArray} />}
        </Box>
      </div>
    );
  }
}

export default observer(Oracles);
