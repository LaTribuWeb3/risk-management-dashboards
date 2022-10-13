import Box from "../components/Box";
import CapInput from "../components/CapInput";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Token from "../components/Token";
import { getRecommendedLT } from "../utils";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import riskStore from "../stores/risk.store";

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
  },
  {
    name: "Current Collateral Factor",
    selector: (row) => row.currentLT,
    width: "260px",
  },
  {
    name: "Recommended Collateral Factor",
    selector: (row) => row.simulationLT,
    format: (row) => getRecommendedLT(row.sandboxValue, row.asset, row.underlying, row.riskParameters),
    grow: 2,
  },
];



class Simulation extends Component {
  render() {
    const { loading } = riskStore["currentRiskLoading"];
    const { json_time } = mainStore["risk_params_data"] || {};
    return (
      <div>
        <Box loading={loading} time={json_time}>
          {/* <h6>Risk Parameters Recommendations</h6> */}
          {!loading && (
            <DataTable
              columns={columns}
              data={riskStore.currentRiskData}
            />
          )}
        </Box>
      </div>
    );
  }
}

export default observer(Simulation);
