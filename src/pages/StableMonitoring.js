import Box from "../components/Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

const Columns = [
  {
    name: "Asset",
    selector: (row) => row.asset,
    format: (row) => row.asset,
  },
  {
    name: "Liquidity",
    selector: (row) => row.liquidity,
    format: (row) => row.liquidity,
    grow: 2,
  },
  {
    name: "Backing Ratio",
    selector: (row) => row.ratio,
    format: (row) => row.ratio,
    width: "260px",
  },
];


const ratioData = [{
    asset: "LUSD",
    liquidity: "12342133212.123412455324",
    ratio: "223"
}];

class StableMonitoring extends Component {
  render() {
    const { loading } = false;
    const { json_time } = mainStore["risk_params_data"] || {};
    return (
      <div>
        <Box loading={loading} time={json_time}>
          {!loading && (
            <DataTable columns={Columns} data={ratioData} />
          )}
        </Box>
      </div>
    );
  }
}

export default observer(StableMonitoring);
