import BlockExplorerLink from "../components/BlockExplorerLink";
import Box from "../components/Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
import { tokenPrice } from "../utils";
import { whaleFriendlyFormater } from "../components/WhaleFriendly";

const columns = [
  {
    name: "User",
    selector: (row) => row.account,
    format: (row) => <BlockExplorerLink address={row.user} />,
    sortable: true,
  },
  {
    name: "Debt Size",
    selector: (row) => whaleFriendlyFormater(row.debt),
    sortable: true,
  },
  {
    name: "Collateral Size",
    selector: (row) => whaleFriendlyFormater(row.collateral),
    sortable: true,
  },
];
class OpenLiquidations extends Component {
  render() {
    const { loading } = poolsStore["creditAccounts_loading"];
    const PoolCreditAccounts = Object.assign(
      poolsStore["creditAccounts_data"].filter(
        (ca) => ca.poolAddress === poolsStore["tab"]
      )
    );

    const jsonTime = PoolCreditAccounts[0]["UpdateData"]["lastUpdate"] / 1000;
    let liquidationData = [];

    for (let i = 0; i < PoolCreditAccounts.length; i++) {
      if (PoolCreditAccounts[i].healthFactor < 10000) {
        liquidationData.push({
          user: PoolCreditAccounts[i].address,
          debt: tokenPrice(
            poolsStore["activeTabSymbol"],
            PoolCreditAccounts[i].borrowedAmountPlusInterestAndFees
          ),
          collateral: PoolCreditAccounts[i].collateralValue,
        });
      }
    }
    const totalDebt = liquidationData.reduce(
      (acc, val) => acc + Number(val.debt),
      0
    );
    const smallLiquidations = totalDebt < 1000;

    return (
      <div>
        <Box loading={loading} time={jsonTime}>
          {!loading && (
            <div>
              {!smallLiquidations && (
                <DataTable
                  columns={columns}
                  data={liquidationData}
                  defaultSortFieldId={2}
                  defaultSortAsc={false}
                />
              )}
              {smallLiquidations && (
                <div style={{ textAlign: "center", padding: "50px" }}>
                  Total open liquidations are lower than $1k 😀
                </div>
              )}
            </div>
          )}
        </Box>
      </div>
    );
  }
}

export default observer(OpenLiquidations);
