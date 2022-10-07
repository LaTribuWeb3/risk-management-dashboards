import React, { Component } from "react";
import { observer } from "mobx-react";
import Box from "../components/Box";
import DataTable from "react-data-table-component";
import mainStore from "../stores/main.store";
import LiquidationsGraph from "../components/LiquidationsGraph";
import { whaleFriendlyFormater } from "../components/WhaleFriendly";
import { makeAutoObservable, runInAction } from "mobx";
import Token from "../components/Token";
import { TopTenAccounts, usersMinWidth } from "../components/TopAccounts";
import poolsStore from "../stores/pools.store";
import { tokenName, tokenPrice } from "../utils";
import { tab } from "@testing-library/user-event/dist/tab";

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
      row[name] = !row[name];
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
        name: "Total Collateral",
        selector: (row) => Number(row["total_collateral"]),
        format: (row) => whaleFriendlyFormater(row["total_collateral"]),
        sortable: true,
        minWidth: "140px",
      },
      {
        name: "Median Collateral",
        selector: (row) => Number(row["median_collateral"]),
        format: (row) => whaleFriendlyFormater(row["median_collateral"]),
        sortable: true,
        minWidth: "140px",
      },
      {
        name: "Top 10 Accounts Collateral",
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
        name: "Top 1 Account Collateral",
        selector: (row) => Number(row["top_1_collateral"]),
        format: (row) => whaleFriendlyFormater(row["top_1_collateral"]),
        sortable: true,
        minWidth: "140px",
      },
    ];

    const loading = poolsStore["data/creditAccounts?fakeMainnet=0_loading"];
    let tokenBalances = {};
    let collateralData = [];
    let tableData = [];
    let userArrays = {};

    if (!loading) {
      const PoolCreditAccounts = Object.assign(
        poolsStore["data/creditAccounts?fakeMainnet=0_data"].filter(
          (ca) => ca.poolAddress === poolsStore["tab"]
        )
      );

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
          if (tokenAmount != 0) {
            // create token entry or
            if (tokenBalances[tokenSymbol] == undefined) {
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
              (tk) => tk.key == tokenSymbol
            );
            if (tokenIndex == -1) {
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
        top10Coll: true,
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
      poolsStore["data/creditAccounts?fakeMainnet=0_data"].filter(
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
        if (tokenAmount != 0) {
          if (userArrays[tokenSymbol] == null) {
            userArrays[tokenSymbol] = [];
            userArrays[tokenSymbol].push({
              id: whaleCreditAccounts[i]["address"],
              size: tokenAmount,
              whale_flag: 1,
            })
          }
          else {
            userArrays[tokenSymbol].push({
              id: whaleCreditAccounts[i]["address"],
              size: tokenAmount,
              whale_flag: 1,
            })
          }
        }
      }
    }

    // update big_collateral array
    for(let i = 0; i < tableData.length; i++){
      let array = userArrays[tableData[i]["key"]];
      array.sort((a, b) => b - a);
      array = array.slice(0,11);
      for(let j = 0; j < array.length; j++){
      tableData[i]["whales"]["big_collateral"].push(array[j])}
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
        (tk) => tk.key == collateralData[i]["key"]
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

    // auto expand first item
    if (tableData.length) {
      tableData[0].defaultExpanded = true;
    }

    // include graph data in tableData
    let apiGraphData = Object.assign(poolsStore["data/liquidations_data"]);
    apiGraphData = apiGraphData.filter(
      (entry) => entry.poolAddress == poolsStore["tab"]
    );
    apiGraphData = apiGraphData[0].liquidations;
    let graphDataArray = [];
    for (const data in apiGraphData) {
      let graphData = {};
      graphData[data] = {};
      let graphArray = {};
      for (const point in apiGraphData[data]) {
        graphArray[apiGraphData[data][point]["priceUsd"]] =
          apiGraphData[data][point]["normalizedTotalLiquidationUsd"];
      }
      graphData[data] = graphArray;
      graphDataArray.push(graphData);
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
    const text = "* Big account included in the list";
    return (
      <div>
        <Box loading={loading} time={Date.now / 1000} text={text}>
          {!loading && (
            <DataTable
              expandableRows
              columns={columns}
              defaultSortFieldId={2}
              defaultSortAsc={true}
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
