import React, { Component } from "react";
import { observer } from "mobx-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../constants";
import BoxGrid from "../components/BoxGrid";
import Box from "../components/Box";
import PieChart from "../components/PieChart";
import mainStore from "../stores/main.store";

class OverviewPieCharts extends Component {
  render() {
    const overviewData = Object.assign({}, mainStore["overview_data"] || {});
    const json_time = Math.floor(Date.now() / 1000);
    const loading = mainStore["overview_loading"]; // TODO

    return (
      <BoxGrid>
        <Box loading={loading} height={480} time={json_time}>
          <h6 style={{ margin: 0 }}>Collateral</h6>
          {!loading && <PieChart data={overviewData.collateralGraphData} />}
        </Box>
        {/* <Box loading={loading} height={450} time={json_time}>
          <h6 style={{margin: 0}}>Debt</h6>
          {!loading && <PieChart data={data} dataKey={'total_debt'}/>}
        </Box> */}
      </BoxGrid>
    );
  }
}

export default observer(OverviewPieCharts);
