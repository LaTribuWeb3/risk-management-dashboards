import Box from "./Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import Token from "./Token";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
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
    format: (row) => displayWhaleFriendly(row.total_liquidation),
    sortable: true,
  },
  {
    name: "Accrued Bad Debt",
    selector: (row) => row.pnl,
    format: (row) => displayWhaleFriendly(row.pnl),
    sortable: true,
  },
  {
    name: "Lowest Liquidation Threshold",
    selector: (row) => row["max_collateral"],
    format: (row) => display(row),
    sortable: true,
  },
];

function display(props) {
  return (
    <div>
      {props.max_collateral == -1
        ? "Not Found"
        : props.max_collateral.toFixed(2)}
    </div>
  );
}
function displayWhaleFriendly(props) {
  return <div>{props == -1 ? "Not Found" : whaleFriendlyFormater(props)}</div>;
}

class RiskParametersSimulation extends Component {
  render() {
    const loading = poolsStore["risk_loading"];
    const rawData = Object.assign({}, poolsStore["risk_data"] || {});
    const tab = poolsStore["activeTabSymbol"];
    let data = [];

    for (const entry in rawData) {
      if (rawData[entry]["underlying"] == tab) {
        for (const point in rawData[entry]["current"]) {
          if (rawData[entry]["current"][point] != null) {
            data.push({
              key: point,
              total_liquidation:
                rawData[entry]["current"][point]["total_liquidation"],
              pnl: rawData[entry]["current"][point]["pnl"],
              max_drop: rawData[entry]["current"][point]["max_drop"],
              max_collateral:
                rawData[entry]["current"][point]["max_collateral"],
            });
          } else {
            data.push({
              key: point,
              total_liquidation: -1,
              pnl: -1,
              max_drop: -1,
              max_collateral: -1,
            });
          }
        }
      }
    }

    const { json_time } = rawData["0"]["json_time"];
    return (
      <div>
        <Box loading={loading} time={json_time}>
          <hgroup>
            <h6>According to Worst Day Scenario</h6>
            <p className="description">
              Worst day simulation is done according to the worst day price-drop
              in ETH history. Other assets are being normalized according to
              their volatility compared to ETH. The simulation considers the
              current LT and users’ usage to present total liquidations and bad
              debt that would have accrued in the platform. The Max Liquidation
              Threshold is the lowest LT that won’t create bad debt for the
              platform in case the same scenario repeats today.
            </p>
          </hgroup>
          {!loading && (
            <DataTable
              columns={columns}
              data={data}
              defaultSortFieldId={2}
              defaultSortAsc={false}
            />
          )}
        </Box>
      </div>
    );
  }
}

export default observer(RiskParametersSimulation);
