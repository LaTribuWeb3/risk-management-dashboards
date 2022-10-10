import Asterisk, { hasAtLeastOneAsterisk } from "./Asterisk";

import Box from "./Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Token from "./Token";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import { whaleFriendlyFormater } from "./WhaleFriendly";

const columns = [
  {
    name: "Asset",
    selector: (row) => row.key,
    format: (row) => <Token value={row.key} />,
    sortable: true,
  },
  {
    name: "Total Liquidations",
    selector: (row) => row.total_liquidation,
    format: (row) => whaleFriendlyFormater(row.total_liquidation),
    sortable: true,
  },
  {
    name: "Accrued Bad Debt",
    selector: (row) => row.pnl,
    format: (row) => whaleFriendlyFormater(row.pnl),
    sortable: true,
  },
  {
    name: "Lowest Liquidation Threshold",
    selector: (row) => row["max_collateral"],
    format: (row) => <Asterisk row={row} field={"max_collateral"} />,
    sortable: true,
  },
];

class RiskParametersSimulation extends Component {
  render() {
    const loading = mainStore["current_simulation_risk_loading"];
    const rawData = Object.assign(
      {},
      mainStore["current_simulation_risk_data"] || {}
    );
    const { json_time } = rawData;
    if (json_time) {
      delete rawData.json_time;
    }
    const data = !loading
      ? Object.entries(rawData).map(([k, v]) => {
        return Object.assign({ key: k }, v.summary);
      })
      : [];
    const text = hasAtLeastOneAsterisk(data, "max_collateral")
      ? "* Decreasing CF to Max CF is recommended."
      : "";
    return (
      <div>
        <Box loading={loading} time={json_time} text={text}>
          <hgroup>
            <h6>According to Worst Day Scenario</h6>
            <p className="description">
              Worst day simulation is done according to the worst day price-drop in ETH history. Other assets are being normalized according to their volatility compared to ETH. The simulation considers the current LT and users’ usage to present total liquidations and bad debt that would have accrued in the platform. The Max Liquidation Threshold is the lowest LT that won’t create bad debt for the platform in case the same scenario repeats today.
            </p>
          </hgroup>
          {!loading && <DataTable columns={columns} data={data} />}
        </Box>
      </div>
    );
  }
}

export default observer(RiskParametersSimulation);
