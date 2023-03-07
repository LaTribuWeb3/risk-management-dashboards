import Accounts from "./Accounts";
import Alerts from "./Alerts";
import { Component } from "react";
import Liquidity from "./Liquidity2";
import OpenLiquidations from "./OpenLiquidations";
import Oracles from "./Oracles";
import Overview from "./Overview";
import RiskParameters from "./RiskParameters";
import ScrollSpy from "react-ui-scrollspy";
import Simulation from "./Simulation";
import StableMonitoring from "./StableMonitoring";
import Summary from "./Summary";
import Tabnav from "../layout/Tabnav";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

class SinglePage extends Component {
  render() {
    return (
      <div>
        <ScrollSpy
          offsetBottom={0}
          scrollThrottle={100}
          parentScrollContainerRef={this.props.scrollContainer}
        >
          <section id="select-pool">
            <Tabnav />
          </section>
          {poolsStore["activeTabSymbol"] === "summary" && <Summary />}
          {poolsStore["activeTabSymbol"] === null && (
            <div className="noaccountsdiv">
              <span className="noaccounts">No pool selected</span>
            </div>
          )}
          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["activeTabSymbol"] !== "summary" &&
            poolsStore["poolHasAccounts"] === 0 && (
              <div className="noaccountsdiv">
                <span className="noaccounts">
                  This pool has no credit accounts.
                </span>
              </div>
            )}

          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="system-status">
                {mainStore.proViewShow("system-status") && (
                  <div>
                    <h2>System Status</h2>
                    <Alerts />
                  </div>
                )}
              </section>
            )}

          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="overview">
                {mainStore.proViewShow("overview") && (
                  <div>
                    <hgroup>
                      <h2>Overview</h2>
                      <p className="description">State of the pool overview</p>
                    </hgroup>
                    <Overview />
                  </div>
                )}
              </section>
            )}
          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="collateral-factors">
                {mainStore.proViewShow("collateral-factors") && (
                  <div>
                    <h2>Collateral Factor Recommendations</h2>
                    <RiskParameters />
                  </div>
                )}
              </section>
            )}

          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="sandbox">
                {mainStore.proViewShow("sandbox") && (
                  <div>
                    <hgroup>
                      <h2> Risk Parameters Sandbox</h2>
                      <p className="description">
                        The sandbox lets you set different Supply caps, to get
                        LTs recommendations according to different caps.{" "}
                      </p>
                    </hgroup>
                    <Simulation />
                  </div>
                )}
              </section>
            )}

          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="asset-distribution">
                {mainStore.proViewShow("asset-distribution") && (
                  <div>
                    <hgroup>
                      <h2>Asset Distribution</h2>
                      <p className="description">
                        The table tracks the main statistics per asset in the
                        platform. Clicking on each row will open a graph
                        describing the expected liquidations according to price
                        changes of the base asset. Liquidations can be executed
                        also if an asset price increases when the asset is the
                        debt asset.
                      </p>
                    </hgroup>
                    <Accounts />
                  </div>
                )}
              </section>
            )}

          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="open-liquidations">
                {mainStore.proViewShow("open-liquidations") && (
                  <div>
                    <hgroup>
                      <h2>Open Liquidations</h2>
                      <p></p>
                    </hgroup>
                    <OpenLiquidations />
                  </div>
                )}
              </section>
            )}

          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="oracle-deviation">
                {mainStore.proViewShow("oracle-deviation") && (
                  <div>
                    <hgroup>
                      <h2>Oracle Deviation</h2>
                      <p className="description">
                        The table tracks the deviation from the oracle price
                        feed used by the platform compared to the assets’ prices
                        taken from Centralized Exchanges (CEX) and Decentralized
                        Exchanges (DEX). This helps monitor any critical
                        deviations that might indicate an oracle manipulation,
                        de-pegging, downtime, etc.
                      </p>
                    </hgroup>
                    <Oracles />
                  </div>
                )}
              </section>
            )}

          {poolsStore["activeTabSymbol"] !== null &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="liquidity">
                {mainStore.proViewShow("liquidity") && (
                  <div>
                    <hgroup>
                      <h2>DEX Liquidity</h2>
                      <p className="description">
                        Monitoring available on-chain DEX liquidity per asset.
                        The graph shows maximum liquidation size that can be
                        executed in a single transaction according to current
                        available DEX liquidity w.r.t current liquidation bonus
                        offered by the platform.
                      </p>
                    </hgroup>
                    <Liquidity />
                  </div>
                )}
              </section>
            )}
          {poolsStore["activeTabSymbol"] !== null &&
            (["DAI", "USDC", "FRAX"].includes(poolsStore["activeTabSymbol"])) &&
            poolsStore["poolHasAccounts"] > 0 && (
              <section id="stablecoin-monitoring">
                {mainStore.proViewShow("stablecoin-monitoring") && (
                  <div>
                    <hgroup>
                      <h2>Stablecoin Monitoring</h2>
                      <p className="description">
                        Monitoring stablecoins health: dex liquidity vs{" "}
                        {poolsStore["activeTabSymbol"]} for 4% slippage and
                        backing ratio where applicable.
                      </p>
                    </hgroup>
                    <StableMonitoring />
                  </div>
                )}
              </section>
            )}
        </ScrollSpy>
      </div>
    );
  }
}

export default observer(SinglePage);
