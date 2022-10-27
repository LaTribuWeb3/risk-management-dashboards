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
    sortable: true,
  },
  {
    name: "Liquidity",
    selector: (row) => row.liquidity,
    format: (row) => "$" + Number(row.liquidity).toFixed(2),
    sortable: true,
  },
  {
    name: "Backing Ratio",
    selector: (row) => row.ratio,
    format: (row) => Number(row.ratio).toFixed(2) + " %",
    sortable: true,
  },
];



const ratioData = [{
    asset: "LUSD",
    liquidity: "12342133212.123412455324",
    ratio: "223"
},{
    asset: "TUSD",
    liquidity: "12342133212.123412455324",
    ratio: "USDC"
},{
    asset: "BLA",
    liquidity: "42342133212.123412455324",
    ratio: "223"
},];

class StableMonitoring extends Component {
  render() {
    const { loading } = false;
    const { json_time } = mainStore["risk_params_data"] || {};
    return (
      <div>
        <Box loading={loading} time={json_time}>
          {!loading && (
            <DataTable defaultSortFieldId={2} defaultSortAsc={false} columns={Columns} data={ratioData} />
          )}
        </Box>
      </div>
    );
  }
}

export default observer(StableMonitoring);
