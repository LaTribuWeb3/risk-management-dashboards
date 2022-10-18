import Box from "../components/Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Ramzor from "../components/Ramzor";
import Token from "../components/Token";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

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

// const ExpandedComponent = ({ data }) => (
//   <pre>{JSON.stringify(data, null, 2)}</pre>
// );

function roundTo(num, dec) {
  const pow = Math.pow(10, dec);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}

class Oracles extends Component {
  render() {
    const loading = poolsStore["tokens_loading"];
    const collaterals = poolsStore["poolCollaterals"];
    let oracleData = Object.assign(
      [],
      poolsStore["tokens_data"] || []
    );
    const jsonTime = Math.floor(
      oracleData["0"]["updateData"]["lastUpdate"] / 1000
    );
    let oracleArray = [];
    oracleData.forEach((entry) => {
      oracleArray.push({
        key: entry.symbol,
        oracle: roundTo(entry.priceUSD18Decimals / 1e18, 4),
        cex_price: entry.cexPriceUSD18Decimals / 1e18,
        dex_price: entry.dexPriceUSD18Decimals / 1e18,
      });
    });

    // filter out collaterals not present in pool
    oracleArray = oracleArray.filter((entry) =>
      collaterals.includes(entry.key)
    );
    return (
      <div>
        <Box loading={loading} time={jsonTime}>
          {!loading && <DataTable columns={columns} data={oracleArray} />}
        </Box>
      </div>
    );
  }
}

export default observer(Oracles);
