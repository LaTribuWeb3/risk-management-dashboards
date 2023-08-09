import { TopTenAccounts, usersMinWidth } from "../components/TopAccounts";
import { tokenName, tokenPrice } from "../utils";

import Box from "../components/Box";
import { Component } from "react";
import DataTable from "react-data-table-component";
import LiquidationsGraph from "../components/LiquidationsGraph";
import Token from "../components/Token";
import alertStore from "../stores/alert.store";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";
import { whaleFriendlyFormater } from "../components/WhaleFriendly";

const rowPreExpanded = (row) => row.defaultExpanded;
class Accounts extends Component {
  render() {
    const onRowExpandToggled = (expanded, row) => {
      if (expanded === false) {
        row.top10Coll = false;
        row.top10Debt = false;
      }
      row.expanded = expanded;
    };

    const toggleTopTen = (row, name) => {
      debugger;
      if (row[name] === undefined) {
        row[name] = true;
      } else {
        row[name] = !row[name];
      }
    };
    const columns = [
      {
        name: "Asset",
        selector: (row) => row.key,
        format: (row) => <Token value={row.key} />,
        sortable: true,
        minWidth: "110px",
      },
      {
        name: "Total Positional Value",
        selector: (row) => Number(row["total_collateral"]),
        format: (row) => whaleFriendlyFormater(row["total_collateral"]),
        sortable: true,
        minWidth: "140px",
      },
      {
        name: "Median Positional Value",
        selector: (row) => Number(row["median_collateral"]),
        format: (row) => whaleFriendlyFormater(row["median_collateral"]),
        sortable: true,
        minWidth: "140px",
      },
      {
        name: "Top 10 Accounts Positional Value",
        selector: (row) => Number(row["top_10_collateral"]),
        format: (row) => (
          <TopTenAccounts
            row={row}
            name={"top10Coll"}
            toggleTopTen={toggleTopTen}
            accounts={row.whales.big_collateral}
            value={whaleFriendlyFormater(row["top_10_collateral"])}
          />
        ),
        sortable: true,
        minWidth: usersMinWidth,
      },
      {
        name: "Top 1 Account Positional Value",
        selector: (row) => Number(row["top_1_collateral"]),
        format: (row) => whaleFriendlyFormater(row["top_1_collateral"]),
        sortable: true,
        minWidth: "140px",
      },
    ];

    const loading = poolsStore["creditAccounts_loading"];
    let tokenBalances = {};
    let collateralData = [];
    let tableData = [];
    let userArrays = {};
    let jsonTime = null;
    if (!loading) {
      const PoolCreditAccounts = Object.assign(
        poolsStore["creditAccounts_data"].filter(
          (ca) => ca.poolAddress === poolsStore["tab"]
        )
      );

      jsonTime = Math.floor(
        PoolCreditAccounts["0"]["UpdateData"]["lastUpdate"] / 1000
      );
      poolsStore["lastUpdate"] = jsonTime;
      /// calculate USD value for each collateral token in the pool
      for (let i = 0; i < PoolCreditAccounts.length; i++) {
        for (
          let j = 0;
          j < PoolCreditAccounts[i]["tokenBalances"].length;
          j++
        ) {
          // define token infos
          const tokenAddress =
            PoolCreditAccounts[i]["tokenBalances"][j]["address"];
          const tokenSymbol = tokenName(tokenAddress);
          const tokenAmount = tokenPrice(
            tokenSymbol,
            PoolCreditAccounts[i]["tokenBalances"][j]["amount"]
          );

          // if token amount is non-null,
          if (tokenAmount > 0) {
            // create token entry or
            if (tokenBalances[tokenSymbol] === undefined) {
              tokenBalances[tokenSymbol] = tokenAmount;
            }
            ///increment total token collateral value
            else {
              tokenBalances[tokenSymbol] = (
                Number(tokenBalances[tokenSymbol]) + Number(tokenAmount)
              ).toString();
            }
            // arrays of collateral token
            const tokenIndex = collateralData.findIndex(
              (tk) => tk.key === tokenSymbol
            );
            if (tokenIndex === -1) {
              collateralData.push({
                key: tokenSymbol,
                balances: [tokenAmount],
              });
            } else {
              collateralData[tokenIndex]["balances"].push(tokenAmount);
            }
          }
        }
      }
    }

    // create objects in tableData and update with total_collateral
    for (const token in tokenBalances) {
      tableData.push({
        key: token,
        defaultExpanded: false,
        total_collateral: tokenBalances[token],
        top_1_collateral: null,
        top_10_collateral: null,
        median_collateral: null,
        graph_data: null,
        whales: {
          big_collateral: [],
          total_collateral: tokenBalances[token],
        },
      });
    }

    /// create userArrays for whales data
    const whaleCreditAccounts = Object.assign(
      poolsStore["creditAccounts_data"].filter(
        (ca) => ca.poolAddress === poolsStore["tab"]
      )
    );
    for (let i = 0; i < whaleCreditAccounts.length; i++) {
      for (let j = 0; j < whaleCreditAccounts[i]["tokenBalances"].length; j++) {
        // define token infos
        const tokenAddress =
          whaleCreditAccounts[i]["tokenBalances"][j]["address"];
        const tokenSymbol = tokenName(tokenAddress);
        const tokenAmount = tokenPrice(
          tokenSymbol,
          whaleCreditAccounts[i]["tokenBalances"][j]["amount"]
        );
        if (tokenAmount >= 0) {
          if (!userArrays[tokenSymbol]) {
            userArrays[tokenSymbol] = [];
            userArrays[tokenSymbol].push({
              id: whaleCreditAccounts[i]["address"],
              size: Number(tokenAmount),
              whale_flag: 1,
            });
          } else {
            userArrays[tokenSymbol].push({
              id: whaleCreditAccounts[i]["address"],
              size: tokenAmount,
              whale_flag: 1,
            });
          }
        }
      }
    }
    // update big_collateral array
    for (let i = 0; i < tableData.length; i++) {
      let array = userArrays[tableData[i]["key"]];
      array.sort((a, b) => b.size - a.size);
      array = array.slice(0, 10);
      for (let j = 0; j < array.length; j++) {
        tableData[i]["whales"]["big_collateral"].push(array[j]);
      }
    }

    // median function for next block
    function getMedian(arr) {
      const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
      return arr.length % 2 !== 0
        ? nums[mid]
        : (Number(nums[mid - 1]) + Number(nums[mid])) / 2;
    }

    //update median, top 1 and top 10 collateral
    for (let i = 0; i < collateralData.length; i++) {
      const tokenIndex = tableData.findIndex(
        (tk) => tk.key === collateralData[i]["key"]
      );
      let median = getMedian(collateralData[i]["balances"]);
      tableData[tokenIndex]["median_collateral"] = median.toString();
      /// update top 10 collateral
      let top10 = collateralData[i]["balances"].sort((a, b) => b - a);
      top10 = top10.slice(0, 10);
      top10 = top10.reduce((prev, curr) => Number(prev) + Number(curr), 0);
      tableData[tokenIndex]["top_10_collateral"] = top10.toString();
      /// update top 1 collateral
      for (let j = 0; j < collateralData[i]["balances"].length; j++) {
        if (
          Number(tableData[tokenIndex]["top_1_collateral"]) <
          Number(collateralData[i]["balances"][j])
        ) {
          tableData[tokenIndex]["top_1_collateral"] =
            collateralData[i]["balances"][j];
        }
      }
    }
    /// get underlying price in USD
    const tokenData = Object.assign([], poolsStore["tokens_data"] || []);
    const underlying = poolsStore["activeTabSymbol"];
    let underlyingPrice = 0;
    for (const token in tokenData) {
      if (tokenData[token].symbol.toLowerCase() === underlying.toLowerCase()) {
        underlyingPrice = tokenData[token]["priceUSD18Decimals"] / 1e18;
      }
    }

    // include graph data in tableData
    let apiGraphData = Object.assign(poolsStore["liquidations_data"]);
    apiGraphData = apiGraphData.filter(
      (entry) => entry.poolAddress === poolsStore["tab"]
    );
    apiGraphData = apiGraphData[0].liquidations;
    let graphDataArray = [];
    for (const data in apiGraphData) {
      let graphData = {};
      graphData[data] = {};
      let graphArray = {};
      for (const point in apiGraphData[data]) {
        /// IF COLLATERAL == UNDERLYING
        if (
          data.toLowerCase() === poolsStore["activeTabSymbol"].toLowerCase()
        ) {
          let x = Number(apiGraphData[data][point]["priceUsd"]);
          const y = apiGraphData[data][point]["normalizedTotalLiquidationUsd"];

          graphArray[x] = y;
        }
        /// IF COLLATERAL /= UNDERLYING
        else {
          let x =
            Number(apiGraphData[data][point]["priceUsd"]) / underlyingPrice;
          const y =
            apiGraphData[data][point]["normalizedTotalLiquidationUsd"] /
            underlyingPrice;
          graphArray[x] = y;
        }
        graphData[data] = graphArray;
        graphDataArray.push(graphData);
      }
    }

    //// TENTATIVE DE PENETRATION DE TABLE DATA
    for (const token in tableData) {
      for (let i = 0; i < graphDataArray.length; i++) {
        const d = graphDataArray[i][tableData[token].key];
        if (d !== undefined) {
          tableData[token]["graph_data"] = graphDataArray[i];
        }
      }
    }

    // update whales alert
    const alerts = [];
    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < tableData[i].whales["big_collateral"].length; j++) {
        if (
          Number(tableData[i].whales["big_collateral"][j].size) >
          Number(tableData[i].total_collateral / 10)
        ) {
          alerts.push({
            asset: tableData[i].key,
            type: "Collateral",
            size: tableData[i].whales["big_collateral"][j].size,
            account: tableData[i].whales["big_collateral"][j].id,
          });
        }
      }
    }
    const type = alerts.length ? "review" : "healthy";
    alertStore["whalesAlerts"] = {
      title: "whales",
      data: alerts,
      type,
      link: "#asset-distribution",
    };
    alertStore["walesAlerts_loading"] = false;

    // sort by size and auto expand first item
    if (tableData.length) {
      tableData.sort((a, b) => b["total_collateral"] - a["total_collateral"]);
      tableData[0].defaultExpanded = true;
    }
    return (
      <div>
        <Box loading={loading} time={jsonTime}>
          {!loading && (
            <DataTable
              expandableRows
              columns={columns}
              defaultSortFieldId={2}
              defaultSortAsc={false}
              data={tableData}
              expandableRowsComponent={LiquidationsGraph}
              expandableRowExpanded={rowPreExpanded}
              onRowExpandToggled={onRowExpandToggled}
            />
          )}
        </Box>
      </div>
    );
  }
}

export default observer(Accounts);
