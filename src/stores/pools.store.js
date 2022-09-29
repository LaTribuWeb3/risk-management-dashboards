import { makeAutoObservable } from "mobx";
import axios from "axios";
import BigNumber from "bignumber.js";
import mainStore from "../stores/main.store";
import alertStore from "../stores/alert.store";

const apiEndpoints = [
  "data/tokens?fakeMainnet=0",
  "pools",
  "data/creditAccounts?fakeMainnet=0",
];
class PoolsStore {
  constructor() {
    this.init();
    makeAutoObservable(this);
  }

  apiUrl = process.env.REACT_APP_API_URL || "http://dev-0.la-tribu.xyz:8081";
  poolsData = {};

  init = () => {
    this["tab"] = null;
    apiEndpoints.forEach(this.fetchData);
  };

  setActiveTab(tab) {
    this.tab = tab;
    mainStore["overview_loading"] = true;
    this.selectedPoolData(tab);
  }

  fetchData = (endpoint) => {
    this[endpoint + "_loading"] = true;
    this[endpoint + "_data"] = null;
    this[endpoint + "_request"] = axios
      .get(`${this.apiUrl}/${endpoint}/`)
      .then(({ data }) => {
        this[endpoint + "_loading"] = false;
        this[endpoint + "_data"] = data;
        if (endpoint == "pools") {
          this["tab"] = data[0].address;
          this.poolsData = data;
        }
        return data;
      })
      .catch(console.error);
  };

  /// DATA TRANSFORMATION
  selectedPoolData(tab) {
    const poolsData = Object.assign([], this["pools_data"] || []);
    const tokenData = Object.assign(
      [],
      this["data/tokens?fakeMainnet=0_data"] || []
    );
    const creditAccountData = Object.assign(
      [],
      this["data/creditAccounts?fakeMainnet=0_data"] || []
    );
    alertStore.valueAtRisk = tab;

    const selectedPool = poolsData.find((p) => p.address === tab);
    const creditAccountsForPool = creditAccountData.filter(
      (ca) => ca.poolAddress === tab
    );

    // compute value in $ for each credit account
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      let collateralValue = 0;
      for (let j = 0; j < creditAccountsForPool[i].tokenBalances.length; j++) {
        const tokenAddress = creditAccountsForPool[i].tokenBalances[j].address;
        const amountWDecimals =
          creditAccountsForPool[i].tokenBalances[j].amount;
        const token = tokenData.filter((tk) => tk.address == tokenAddress);
        const tokenDecimals = token[0]["decimals"];
        const tokenPrice = BigNumber(token[0]["priceUSD18Decimals"])
          .div(1e18)
          .toString();
        const amount = BigNumber(amountWDecimals)
          .div(BigNumber(10).pow(tokenDecimals))
          .toString();
        if (amountWDecimals !== "0") {
          collateralValue = BigNumber(collateralValue).plus(
            BigNumber(amount).multipliedBy(BigNumber(tokenPrice))
          );
        }
      }
      creditAccountsForPool[i]["collateralValue"] = collateralValue.toString();
    }

    // compute total collateral value for pool
    let totalCollateral = 0;
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      totalCollateral = BigNumber(totalCollateral).plus(
        BigNumber(creditAccountsForPool[i]["collateralValue"])
      );
    }
    const calculatedTotalCollateral = totalCollateral;
    //////END

    // compute top 1 collateral
    let currentTopOneCollateral = 0;
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      if (
        BigNumber(currentTopOneCollateral).isLessThan(
          BigNumber(creditAccountsForPool[i]["collateralValue"])
        )
      ) {
        currentTopOneCollateral = creditAccountsForPool[i]["collateralValue"];
      }
    }

    const calculatedTop1Collateral = currentTopOneCollateral;
    //////END

    // compute top 10 collateral
    let collateralArray = [];
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      collateralArray.push(creditAccountsForPool[i]["collateralValue"]);
    }
    console.log("collateralArray is", collateralArray);
    collateralArray.sort((a, b) => a - b);
    console.log("sorted", collateralArray);
    const calculatedTop10Collateral = 0; // TODO

    // compute total debt
    let totalDebt = 0;
    const poolUnderlying = tokenData.filter(
      (tk) => tk.address == selectedPool["underlying"]
    );
    const underlyingPrice = BigNumber(
      poolUnderlying[0]["priceUSD18Decimals"]
    ).div(BigNumber(10).pow(18));
    totalDebt = BigNumber(selectedPool.totalBorrowed).div(
      BigNumber(10).pow(poolUnderlying[0]["decimals"])
    );
    totalDebt = BigNumber(totalDebt).multipliedBy(BigNumber(underlyingPrice));
    const calculatedTotalDebt = totalDebt.toString();

    // compute top 1 debt
    let currentTopOneDebt = 0;
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      if (
        BigNumber(currentTopOneDebt).isLessThan(
          BigNumber(
            creditAccountsForPool[i]["borrowedAmountPlusInterestAndFees"]
          )
        )
      ) {
        currentTopOneDebt =
          creditAccountsForPool[i]["borrowedAmountPlusInterestAndFees"];
      }
    }
    currentTopOneDebt = BigNumber(currentTopOneDebt).div(
      BigNumber(10).pow(poolUnderlying[0]["decimals"])
    );
    currentTopOneDebt = BigNumber(currentTopOneDebt).multipliedBy(
      BigNumber(underlyingPrice)
    );
    const calculatedTop1Debt = currentTopOneDebt.toString();
    //////END

    const calculatedTop10Debt = 0; // TODO

    // compute pool's tokens sums
    const indexedTokenSum = {};
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      for (let j = 0; j < creditAccountsForPool[i].tokenBalances.length; j++) {
        const tokenAddress = creditAccountsForPool[i].tokenBalances[j].address;
        const amount = creditAccountsForPool[i].tokenBalances[j].amount;
        const indexedToken = tokenData.filter(
          (tk) => tk.address == tokenAddress
        )[0];
        const valToAddBN = BigNumber(amount);
        if (valToAddBN.gt(0)) {
          const symbol = indexedToken["symbol"]; // find token symbol from token address
          let lastValue = indexedTokenSum[symbol];
          if (lastValue === undefined) {
            lastValue = 0;
          }
          const lastValBN = BigNumber(lastValue);

          const tokenDecimals = indexedToken["decimals"]; // todo replace by good value
          let newTokenAmount = lastValBN.plus(valToAddBN);
          // console.log(newTokenAmount.toString());
          newTokenAmount = newTokenAmount.div(BigNumber(10).pow(tokenDecimals));
          const indexedTokenPrice = BigNumber(
            indexedToken["priceUSD18Decimals"]
          ).div(BigNumber(10).pow(18));
          newTokenAmount = BigNumber(newTokenAmount).multipliedBy(
            BigNumber(indexedTokenPrice)
          );
          // console.log(newTokenAmount.toString());
          newTokenAmount = newTokenAmount.toNumber();
          // console.log(newTokenAmount.toString());
          indexedTokenSum[symbol] = newTokenAmount;
        }
      }

      const dataOverview = {
        collateral: {
          totalCollateral: calculatedTotalCollateral,
          top1Collateral: calculatedTop1Collateral,
          top10Collateral: calculatedTop10Collateral,
        },
        debt: {
          totalDebt: calculatedTotalDebt,
          top1Debt: calculatedTop1Debt,
          top10Debt: calculatedTop10Debt,
        },
        collateralGraphData: indexedTokenSum,
      };

      mainStore["overview_data"] = dataOverview;
      mainStore["overview_loading"] = false;

      /*
          if(selectedLabel.includes('DAI')) {
            mainStore['overview_data'] = dummy1Overview;
            alertStore.liquidationsAtRisk = 100;
          } else if(selectedLabel.includes('USDC')) {
            mainStore['overview_data'] = dummy2Overview;
            alertStore.liquidationsAtRisk = 89999;
          } else {
            mainStore['overview_data'] = dummy3Overview;
            alertStore.liquidationsAtRisk = 20050;
          }
          */
    }
  }
}

export default new PoolsStore();
