import { makeAutoObservable } from "mobx";
import axios from "axios";
import BigNumber from "bignumber.js";
import mainStore from "../stores/main.store";
import alertStore from "../stores/alert.store";
import usdcLiquidity from "./USDC_pool_usd_volume_for_slippage.json";
import wbtcLiquidity from "./WBTC_pool_usd_volume_for_slippage.json";
import wethLiquidity from "./WETH_pool_usd_volume_for_slippage.json";
import daiLiquidity from "./DAI_pool_usd_volume_for_slippage.json";
import stethLiquidity from "./stETH_pool_usd_volume_for_slippage.json";

const apiEndpoints = [
  "data/tokens?fakeMainnet=0",
  "data/creditAccounts?fakeMainnet=0",
  "pools",
  'data/liquidations',
];
class PoolsStore {
  constructor() {
    this.init();
    makeAutoObservable(this);
  }
  roundTo(num, dec) {
    const pow = Math.pow(10, dec);
    return Math.round((num + Number.EPSILON) * pow) / pow;
  }

  apiUrl = process.env.REACT_APP_API_URL || "http://dev-0.la-tribu.xyz:8081";
  poolsData = {};

  init = () => {
    this["tab"] = null;
    this["activeTabSymbol"] = null;
    this["poolHasAccounts"] = 0;
    this["usdc_liquidity_data"] = usdcLiquidity;
    this["wbtc_liquidity_data"] = wbtcLiquidity;
    this["weth_liquidity_data"] = wethLiquidity;
    this["dai_liquidity_data"] = daiLiquidity;
    this["steth_liquidity_data"] = stethLiquidity;
    this["oracle_deviation_data"] = null;
    this["oracles_loading"] = true;
    this["dex_liquidity_loading"] = true;
    apiEndpoints.forEach(this.fetchData);
  };

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
          this["activeTabSymbol"] = data[0].symbol;
          this.poolsData = data;
        }
        this.setActiveTab(this.tab, this.activeTabSymbol);
        return data;
      })
      .catch(console.error);
  };

  setActiveTab(tab, symbol) {
    this["tab"] = tab;
    this["activeTabSymbol"] = symbol;
    this["poolHasAccounts"] = 0;
    mainStore["overview_loading"] = true;
    this["dex_liquidity_loading"] = true;
    mainStore["overview_data"] = null;
    /// check if pool has credit accounts active:
    const PoolCreditAccounts = Object.assign(
      [],
      this["data/creditAccounts?fakeMainnet=0_data"] || []
    ).filter((ca) => ca.poolAddress === tab);
    if (PoolCreditAccounts.length > 0) {
      this["poolHasAccounts"] = 1;
    }
    this.selectedPoolData(tab);
    this.updateDexLiquidity(symbol);
    this.oracleDeviation();
  }

  updateDexLiquidity(symbol) {
    if (symbol.toLowerCase() == "wsteth") {
      symbol = "stETH";
    }
    let liquidity_data = this[symbol.toLowerCase() + "_liquidity_data"];
    delete liquidity_data.json_time;
    liquidity_data = Object.entries(liquidity_data);
    let liquidityArray = [];
    liquidity_data.forEach((entry) => {
      liquidityArray.push({
        name: entry[0],
        value: entry[1][symbol]["volume"],
      });
    });
    this["liquidityData"] = liquidityArray;
    this["dex_liquidity_loading"] = false;
  }

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
    collateralArray.sort((a, b) => b - a);
    collateralArray = collateralArray.slice(0, 10);
    let initialCollateralValue = 0;
    collateralArray = collateralArray.reduce(
      (prev, curr) => Number(prev) + Number(curr),
      initialCollateralValue
    );
    const calculatedTop10Collateral = collateralArray.toString();

    // compute total debt
    let totalDebtArray = [];
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      totalDebtArray.push(
        creditAccountsForPool[i]["borrowedAmountPlusInterestAndFees"]
      );
    }
    let totalDebt = 0;
    totalDebt = totalDebtArray.reduce(
      (prev, curr) => Number(prev) + Number(curr),
      totalDebt
    );
    const poolUnderlying = tokenData.filter(
      (tk) => tk.address == selectedPool["underlying"]
    );
    const underlyingPrice = BigNumber(
      poolUnderlying[0]["priceUSD18Decimals"]
    ).div(BigNumber(10).pow(18));

    totalDebt = BigNumber(totalDebt).div(
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

    /// compute top 10 debt
    let debtArray = [];
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      debtArray.push(
        creditAccountsForPool[i]["borrowedAmountPlusInterestAndFees"]
      );
    }
    debtArray.sort((a, b) => b - a);
    debtArray = debtArray.slice(0, 10);
    let debtValue = 0;
    for (let i = 0; i < debtArray.length; i++) {
      debtValue = BigNumber(debtValue).plus(BigNumber(debtArray[i]));
    }

    debtValue = BigNumber(debtValue).div(
      BigNumber(10).pow(poolUnderlying[0]["decimals"])
    );
    debtValue = Number(underlyingPrice) * Number(debtValue);
    const calculatedTop10Debt = debtValue.toString();

    // compute pool's tokens sums
    const indexedTokenSum = {};
    for (let i = 0; i < creditAccountsForPool.length; i++) {
      for (let j = 0; j < creditAccountsForPool[i].tokenBalances.length; j++) {
        const tokenAddress = creditAccountsForPool[i].tokenBalances[j].address;
        const amount = creditAccountsForPool[i].tokenBalances[j].amount;
        const indexedToken = tokenData.filter(
          (tk) => tk.address == tokenAddress
        )[0];

        let valToAddBN = BigNumber(amount);
        if (valToAddBN.gt(0)) {
          const symbol = indexedToken["symbol"];
          let lastValue = indexedTokenSum[symbol];
          // check if token is already inside object
          if (lastValue === undefined) {
            lastValue = 0;
          }
          const lastValBN = BigNumber(lastValue);
          const tokenDecimals = indexedToken["decimals"];
          const indexedTokenPrice = BigNumber(
            indexedToken["priceUSD18Decimals"]
          ).div(BigNumber(10).pow(18));
          valToAddBN = BigNumber(valToAddBN).div(
            BigNumber(10).pow(tokenDecimals)
          );
          valToAddBN = BigNumber(valToAddBN).multipliedBy(
            BigNumber(indexedTokenPrice)
          );
          let newTokenAmount = lastValBN.plus(valToAddBN);
          newTokenAmount = newTokenAmount.toNumber();
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
    }
  }
}

export default new PoolsStore();
