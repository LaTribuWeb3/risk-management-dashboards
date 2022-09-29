import React, { Component } from "react";
import { observer } from "mobx-react";
import Box from "../components/Box";
import DataTable from "react-data-table-component";
import mainStore from "../stores/main.store";
import Ramzor from "../components/Ramzor";
import Token from "../components/Token";

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
    name: "Platform’s Oracle Price ",
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

class Oracles extends Component {
  render() {
    const loading = mainStore["oracles_loading"];
    const rawData = Object.assign({}, mainStore["oracles_data"] || {});
    const { json_time } = rawData;
    if (json_time) {
      delete rawData.json_time;
    }
    const data = !loading
      ? Object.entries(rawData).map(([k, v]) => {
          v.key = k;
          return v;
        })
      : [];

    return (
      <div>
        <Box loading={loading} time={json_time}>
          {!loading && <DataTable columns={columns} data={data} />}
        </Box>
      </div>
    );
  }
}

export default observer(Oracles);
