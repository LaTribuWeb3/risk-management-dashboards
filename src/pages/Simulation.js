import Box from "../components/Box";
import CapInput from "../components/CapInput";
import CfDiff from "../components/CfDiff";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Token from "../components/Token";
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
    format: (row) => <CapInput row={row} field={"mint_cap"} />,
    grow: 2,
  },
  {
    name: "Current Collateral Factor",
    selector: (row) => row.currentLT,
    width: "260px",
  },
  {
    name: "Recommended Collateral Factor",
    selector: (row) => row.collateral_factor,
    format: (row) => <CfDiff row={row} />,
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
