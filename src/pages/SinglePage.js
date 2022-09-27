import React, { Component } from "react";
import { observer } from "mobx-react"
import Overview from './Overview'
import Liquidity from './Liquidity2'
import Accounts from "./Accounts";
import Oracles from "./Oracles";
import RiskParameters from "./RiskParameters";
import Simulation from "./Simulation";
import Alerts from './Alerts';
import OpenLiquidations from "./OpenLiquidations";
import ScrollSpy from "react-ui-scrollspy";
import mainStore from '../stores/main.store';
import Debug from './Debug';
import Tabnav from "../layout/Tabnav";

class SinglePage extends Component {
  render() {
    const { proViewShow } = mainStore
    return (
      <div>
        <Tabnav />
        <ScrollSpy offsetBottom={400} scrollThrottle={100} parentScrollContainerRef={this.props.scrollContainer}>
          {/* <section id="system-status">
            {mainStore.proViewShow("system-status") && <div>
              <h2>System Status</h2>
              <Alerts />
            </div>}
          </section> */}
          <section id="overview">
            {mainStore.proViewShow("overview") && <div>
              <hgroup>
                <h2>Overview</h2>
                <p className="description">State of the platform overview</p>
              </hgroup>
              <Overview />
            </div>}
          </section>
          {/* <section id="collateral-factors">
            {mainStore.proViewShow("collateral-factors") && <div>
              <h2>Collateral Factor Recommendations</h2>
              <RiskParameters />
            </div>}
          </section>
          <section id="sandbox">
            {mainStore.proViewShow("sandbox") && <div>
              <hgroup>
                <h2> Risk Parameters Sandbox</h2>
                <p className="description">The sandbox lets you set different Supply and Borrow caps to get Collateral Factor recommendations according to different caps. The tool also provides optimization setting recommendations. </p>
              </hgroup>
              <Simulation />
            </div>}
          </section>
          <section id="asset-distribution">
            {mainStore.proViewShow("asset-distribution") && <div>
              <hgroup>
                <h2>Asset Distribution</h2>
                <p className="description">
                  The table tracks the main statistics per asset in the platform.
                  Clicking on each row will open a graph describing the expected liquidations according to price changes of the base asset. Liquidations can be executed also if an asset price increases when the asset is the debt asset.
                </p>
              </hgroup>
              <Accounts />
            </div>}
          </section>
          <section id="open-liquidations">
            {mainStore.proViewShow("open-liquidations") && <div>
              <hgroup>
                <h2>Open Liquidations</h2>
                <p></p>
              </hgroup>
              <OpenLiquidations />
            </div>}
          </section>
          <section id="oracle-deviation">
            {mainStore.proViewShow("oracle-deviation") && <div>
              <hgroup>
                <h2>Oracle Deviation</h2>
                <p className="description">The table tracks the deviation from the oracle price feed used by the platform compared to the assets’ prices taken from Centralized Exchanges (CEX) and Decentralized Exchanges (DEX). This helps monitor any critical deviations that might indicate an oracle manipulation, de-pegging, downtime, etc.</p>
              </hgroup>
              <Oracles />
            </div>}
          </section>
          <section id="liquidity">
            {mainStore.proViewShow("liquidity") && <div>
              <hgroup>
                <h2>DEX Liquidity</h2>
                <p className="description">Monitoring available on-chain DEX liquidity per asset.
                  The statistics monitor the top accounts portion of total liquidity as well as the average and median size of LP positions.
                </p>
              </hgroup>
              <Liquidity />
            </div>}
          </section> */}
        </ScrollSpy>
        <Debug />
      </div>
    )
  }
}

export default observer(SinglePage)