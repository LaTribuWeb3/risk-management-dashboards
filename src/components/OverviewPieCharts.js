import Box from "../components/Box";
import BoxGrid from "../components/BoxGrid";
import { Component } from "react";
import PieChart from "../components/PieChart";
import { observer } from "mobx-react";

class OverviewPieCharts extends Component {
  render() {
    const overviewData = this.props.data;
    const json_time = this.props.time;
    const loading = false;

    return (
      <BoxGrid>
        <Box loading={loading} height={650} time={json_time}>
          <h6 style={{ margin: 0 }}>Positional Value</h6>
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
