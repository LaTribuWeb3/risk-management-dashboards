import Box from "../components/Box";
import CapInput from "../components/CapInput";
import { Component } from "react";
import DataTable from "react-data-table-component";
import SimulationDisplay from "../components/simulationDisplay";
import Token from "../components/Token";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
import riskStore from "../stores/risk.store";
import { tableStyle } from "../utils";

const columns = [
  {
    name: "Asset",
    selector: (row) => row.asset,
    format: (row) => <Token value={row.asset} />,
  },
  {
    name: "Supply",
    selector: (row) => row.mint_cap,
    format: (row) => <CapInput row={row} field={"sandboxValue"} />,
    grow: 2,
    sortable: true,
  },
  {
    name: "Current Liquidation Threshold",
    selector: (row) => row.currentLT,
    width: "260px",
  },
  {
    name: "Recommended Liquidation Threshold",
    selector: (row) => row.simulationLT,
    format: (row) => <SimulationDisplay row={row} />,
    grow: 2,
  },
];
class Simulation extends Component {
  render() {
    const rawData = Object.assign({}, poolsStore["risk_data"] || {});
    const { loading } = riskStore["currentRiskLoading"];
    return (
      <div>
        <Box loading={loading} time={rawData["0"]["json_time"]}>
          {/* <h6>Risk Parameters Recommendations</h6> */}
          {!loading && (
            <DataTable dense customStyles={tableStyle} defaultSortFieldId={2}
            defaultSortAsc={false} columns={columns} data={riskStore.currentRiskData} />
          )}
        </Box>
      </div>
    );
  }
}

export default observer(Simulation);
