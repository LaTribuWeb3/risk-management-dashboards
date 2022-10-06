import React, { Component } from "react";
import { observer } from "mobx-react";
import Box from "../components/Box";
import DataTable from "react-data-table-component";
import mainStore from "../stores/main.store";
import Ramzor from "../components/Ramzor";
import Token from "../components/Token";
import poolsStore from "../stores/pools.store";

const percentFrom = (base, num) => {
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

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);

function roundTo(num, dec) {
  const pow = Math.pow(10, dec);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}

class Oracles extends Component {
  render() {
    const loading = poolsStore["data/tokens?fakeMainnet=0_loading"];
    const collaterals = poolsStore["poolCollaterals"];
    const { json_time } = Date.now;
    let oracleData = Object.assign(
      [],
      poolsStore["data/tokens?fakeMainnet=0_data"] || []
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
        <Box loading={loading} time={json_time}>
          {!loading && <DataTable columns={columns} data={oracleArray} />}
        </Box>
      </div>
    );
  }
}

export default observer(Oracles);
