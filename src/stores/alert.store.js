import { makeAutoObservable } from "mobx";

class AlertStore {
  constructor() {
    this.init();
    makeAutoObservable(this);
  }

  init = () => {
    this["totalLiquidations"] = null;
    this["totalLiquidations_loading"] = true;
    this["oracleDeviation"] = null;
    this["oracleDeviation_loading"] = true;
    this["whalesAlerts"] = null;
    this["walesAlerts_loading"] = true;
    this["collateralAlerts"] = null;
    this["collateralAlerts_loading"] = true;
  };
}

export default new AlertStore();
