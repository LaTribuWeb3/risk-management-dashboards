import axios from "axios";
import mainStore from "../stores/main.store";
import { makeAutoObservable } from "mobx";

const apiEndpoints = [
  "data/tokens?fakeMainnet=0",
  "data/creditAccounts?fakeMainnet=0",
  "pools",
  "data/liquidations",
  "data/liquidity",
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
    this["poolCollaterals"] = [];
    this["activeTabSymbol"] = null;
    this["poolHasAccounts"] = 0;
    apiEndpoints.forEach(this.fetchData);
    this["dex_liquidity_loading"] = false;
  };

  fetchData = (endpoint) => {
    this[endpoint + "_loading"] = true;
    this[endpoint + "_data"] = null;
    this[endpoint + "_request"] = axios
      .get(`${this.apiUrl}/${endpoint}/`)
      .then(({ data }) => {
        this[endpoint + "_loading"] = false;
        this[endpoint + "_data"] = data;
        // if (endpoint === "pools") {
        //   this["tab"] = data[0].address;
        //   this["activeTabSymbol"] = data[0].symbol;
        // }
        return data;
      })
      .catch(console.error);
  };

  setActiveTab(tab, symbol) {
    this["tab"] = tab;
    this["activeTabSymbol"] = symbol;
    this["poolHasAccounts"] = 0;
    mainStore["overview_loading"] = true;
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
  }
}

export default new PoolsStore();
