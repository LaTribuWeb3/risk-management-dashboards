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
  "data/liquidations",
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
    this['poolCollaterals'] = [];
    this["activeTabSymbol"] = null;
    this["poolHasAccounts"] = 0;
    this["usdc_liquidity_data"] = usdcLiquidity;
    this["wbtc_liquidity_data"] = wbtcLiquidity;
    this["weth_liquidity_data"] = wethLiquidity;
    this["dai_liquidity_data"] = daiLiquidity;
    this["steth_liquidity_data"] = stethLiquidity;
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
      mainStore["overview_loading"] = false;
    }
    this.updateDexLiquidity(symbol);
    
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
}

export default new PoolsStore();
