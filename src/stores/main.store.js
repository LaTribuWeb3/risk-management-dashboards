import axios from "axios";
import { makeAutoObservable } from "mobx";

const platformId = window.APP_CONFIG.PLATFORM_ID;

const defaultSections = {
  "system-status": true,
  "select-pool": true,
  overview: true,
  "asset-distribution": true,
};

class MainStore {
  apiUrl = process.env.REACT_APP_API_URL || "https://analytics.riskdao.org";
  blackMode = true;
  loading = {};
  apiData = {};
  proView = true;

  constructor() {
    this.init();
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // dark mode
      this.blackMode = true;
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        this.blackMode = !!e.matches;
      });
    if (window.innerWidth < 811) {
      this["mobile"] = true;
    }

    console.log("mobile?", this["mobile"]);
    makeAutoObservable(this);
  }

  toggleProView = () => (this.proView = !this.proView);

  proViewShow = (section) => this.proView || defaultSections[section];

  setBlackMode = (mode) => {
    this.blackMode = mode;
  };

  init = () => {
    this["overview_loading"] = true;
    this["overview_data"] = null;
  };

  clean = (data) => {
    const clean = Object.assign({}, data);
    if (clean.json_time) {
      delete clean.json_time;
    }
    return clean;
  };

  fetchData = (endpoint) => {
    this[endpoint + "_loading"] = true;
    this[endpoint + "_data"] = null;
    this[endpoint + "_request"] = axios
      .get(`${this.apiUrl}/${endpoint}/${platformId}`)
      .then(({ data }) => {
        this[endpoint + "_loading"] = false;
        this[endpoint + "_data"] = data;
        return data;
      })
      .catch(console.error);
  };
}

export default new MainStore();
