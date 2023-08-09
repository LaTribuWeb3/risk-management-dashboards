import axios from "axios";
import mainStore from "../stores/main.store";
import { makeAutoObservable } from "mobx";

const apiEndpoints = [
  "tokens",
  "creditAccounts",
  "pools",
  "liquidations",
  "liquidity",
  "risk",
  "summary",
];
const isStaging = window.location.hostname.includes("-staging") || window.location.hostname.includes("localhost");
class PoolsStore {
  constructor() {
    this.init();
    makeAutoObservable(this);
  }
  roundTo(num, dec) {
    const pow = Math.pow(10, dec);
    return Math.round((num + Number.EPSILON) * pow) / pow;
  }

  getApiVersion = () => {
    const qsApiVersion = new URLSearchParams(window.location.search).get(
      "api-version"
    );
    if (qsApiVersion) return new Promise((resolve) => resolve(qsApiVersion));
    return axios
      .get(
        `https://raw.githubusercontent.com/Risk-DAO/version-control/main/gearbox`
      )
      .then(({ data }) => data.trim().replace("\n", ""));
  };

  apiUrl =
    "https://raw.githubusercontent.com/Risk-DAO/simulation-results/main/gearbox/";
  poolsData = {};

  init = () => {
    this["version"] = null;
    this.apiVersionPromise = this.getApiVersion();
    this["tab"] = null;
    this["totalLiquidations"] = null;
    this["totalLiquidations_Loading"] = true;
    this["poolCollaterals"] = [];
    this["collateralValues"] = [];
    this["activeTabSymbol"] = null;
    this["lastUpdate"] = null;
    this["summaryDisabled"] = null;
    this["poolHasAccounts"] = 0;
    this["updated"] = 0;
    apiEndpoints.forEach(this.fetchData);
  };

  fetchData = (endpoint) => {
    this[endpoint + "_loading"] = true;
    this[endpoint + "_data"] = null;
    this[endpoint + "_request"] = this.apiVersionPromise
      .then((version) => {
        let url;
        if (isStaging) {
          url = `${this.apiUrl}staging/${endpoint}.json`;
        } else {
          url = `${this.apiUrl}main/${version}/${endpoint}.json`;
        }
        return axios.get(url);
      })
      .then(({ data }) => {
        this[endpoint + "_loading"] = false;
        this[endpoint + "_data"] = data;
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
      this["creditAccounts_data"] || []
    ).filter((ca) => ca.poolAddress === tab);
    if (PoolCreditAccounts.length > 0) {
      this["poolHasAccounts"] = 1;
      mainStore["overview_loading"] = false;
    }
  }
}

export default new PoolsStore();
