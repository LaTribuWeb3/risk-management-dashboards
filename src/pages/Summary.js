import Box from "../components/Box";
import BoxGrid from "../components/BoxGrid";
import BoxRow from "../components/BoxRow";
import { Component } from "react";
import OverviewPieCharts from "../components/OverviewPieCharts";
import WhaleFriendly from "../components/WhaleFriendly";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

class Summary extends Component {
  render() {
    let overviewData = {};
    const data = Object.assign([], poolsStore["summary_data"] || []);

    const loading = poolsStore["summary_loading"];

    const jsonTime = Math.floor(data["updateData"]["lastUpdate"] / 1000);

    overviewData = { ...data["gearboxOverview"] };
    /// remove < 1$ tokens
    for (const data in overviewData["collateralGraphData"]) {
      if (Number(overviewData["collateralGraphData"][data]) < 1) {
        delete overviewData["collateralGraphData"][data];
      }
    }
    return (
      <div>
        <OverviewPieCharts data={overviewData} time={jsonTime} />
        <BoxGrid>
          <Box loading={loading} time={jsonTime}>
            <div>
              <BoxRow key="total_collateral">
                <div>Total Positional Value</div>
                <div>
                  <WhaleFriendly
                    num={overviewData.collateral?.totalCollateral}
                  />
                </div>
              </BoxRow>
              <BoxRow key="median_collateral">
                <div>Median Positional Value per User</div>
                <div>
                  <WhaleFriendly
                    num={overviewData.collateral?.medianCollateral}
                  />
                </div>
              </BoxRow>
              <BoxRow key="top1collateral">
                <div>Positional Value of Top 1 User</div>
                <div>
                  <WhaleFriendly
                    num={overviewData.collateral?.top1Collateral}
                  />
                </div>
              </BoxRow>
              <BoxRow key="top10collateral">
                <div>Positional Value of Top 10 Users</div>
                <div>
                  <WhaleFriendly
                    num={overviewData.collateral?.top10Collateral}
                  />
                </div>
              </BoxRow>
            </div>
          </Box>
          <Box loading={loading} time={jsonTime}>
            <div>
              <BoxRow key="total_debt">
                <div>Total Debt</div>
                <div>
                  <WhaleFriendly num={overviewData.debt?.totalDebt} />
                </div>
              </BoxRow>
              <BoxRow key="median_debt">
                <div>Median Debt per User</div>
                <div>
                  <WhaleFriendly num={overviewData.debt?.medianDebt} />
                </div>
              </BoxRow>
              <BoxRow key="top1debt">
                <div>Debt of Top 1 User</div>
                <div>
                  <WhaleFriendly num={overviewData.debt?.top1Debt} />
                </div>
              </BoxRow>
              <BoxRow key="top10debt">
                <div>Debt of Top 10 Users</div>
                <div>
                  <WhaleFriendly num={overviewData.debt?.top10Debt} />
                </div>
              </BoxRow>
            </div>
          </Box>
        </BoxGrid>
      </div>
    );
  }
}

export default observer(Summary);
