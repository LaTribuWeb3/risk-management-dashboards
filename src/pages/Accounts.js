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
import BigNumber from "bignumber.js";

class LocalStore {
  looping = true;

  constructor() {
    if (window.APP_CONFIG.feature_flags.loopingToggle === false) {
      this.looping = false;
    }
    makeAutoObservable(this);
  }

  toggleLooping = () => {
    this.looping = !this.looping;
  };

  get loopingPrefix() {
    return !this.looping ? "" : "nl_";
  }

  prefixLooping = (str) => {
    return this.loopingPrefix + str;
  };
}

const localStore = new LocalStore();

const rowPreExpanded = (row) => row.defaultExpanded;

class Accounts extends Component {
  render() {
    const { prefixLooping } = localStore;

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
        selector: (row) => Number(row[prefixLooping("total_collateral")]),
        format: (row) =>
          whaleFriendlyFormater(row[prefixLooping("total_collateral")]),
        sortable: true,
        minWidth: "140px",
      },
      {
        name: "Median Collateral",
        selector: (row) => Number(row[prefixLooping("median_collateral")]),
        format: (row) =>
          whaleFriendlyFormater(row[prefixLooping("median_collateral")]),
        sortable: true,
        minWidth: "140px",
      },
      {
        name: "Top 10 Accounts Collateral",
        selector: (row) => Number(row[prefixLooping("top_10_collateral")]),
        format: (row) => (
          <TopTenAccounts
            row={row}
            name={"top10Coll"}
            toggleTopTen={toggleTopTen}
            accounts={row.whales.big_collateral}
            value={whaleFriendlyFormater(
              row[prefixLooping("top_10_collateral")]
            )}
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
    ///Top 1 collateral

    // if(data.length){
    //   data[0].defaultExpanded = true
    // }

    const text = "* Big account included in the list";
    return (
      <div>
        {/* <Box loading={loading} time={Date.now/1000} text={text}>
        {window.APP_CONFIG.feature_flags.loopingToggle && <fieldset>
          <label htmlFor="switch">
            <input onChange={localStore.toggleLooping} defaultChecked={localStore.looping} type="checkbox" id="switch" name="switch" role="switch"/>
            <span>Ignore correlated debt and collateral, and assets not in market</span>
          </label>
        </fieldset>}
          {!loading && <DataTable
              expandableRows
              columns={columns}
              defaultSortFieldId={2}
              defaultSortAsc={true}
              data={data}
              // expandableRowsComponent={LiquidationsGraph}
              expandableRowExpanded={rowPreExpanded}
              onRowExpandToggled={onRowExpandToggled}
          />}
        </Box> */}
      </div>
    );
  }
}

export default observer(Accounts);
