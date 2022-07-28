import React, { Component } from "react";
import {observer} from "mobx-react"
import Overview from './Overview'
import Liquidity from './Liquidity'
import Accounts from "./Accounts";
import Oracles from "./Oracles";
import RiskParameters from "./RiskParameters";
import Simulation from "./Simulation";
import Alerts from './Alerts';
import ScrollSpy from "react-ui-scrollspy";


class SinglePage extends Component {

  render (){
    return (
      <ScrollSpy offsetBottom={200} scrollThrottle={100} parentScrollContainerRef={this.props.scrollContainer}>
        <section id="system-status">
          <h1>System Status</h1>
          <Alerts/>
        </section>       
         <section id="overview">
          <hgroup>
            <h1 >Overview</h1>
            <p>State of the platform overview</p>
          </hgroup>
          <Overview/>
        </section>
        <section id="asset-distribution">
          <hgroup>
            <h1>Asset Distribution</h1>
            <p>
              The table tracks the main statistics per asset in the platform. 
              Clicking on each row will open a graph describing the expected liquidations according to price changes of the base asset. Liquidations can be executed also if an asset price increases when the asset is the debt asset. 
              Users can sort the table using the arrows on each column.
            </p>
          </hgroup>

          <Accounts/>
        </section>
        <section  id="oracle-deviation">
          <hgroup>
            <h1>Oracle Deviation</h1>
            <p>The table tracks the deviation from the oracle price feed used by the platform compared to the assets’ prices taken from Centralized Exchanges (CEX) and Decentralized Exchanges (DEX). This helps monitor any critical deviations that might indicate an oracle manipulation, de-pegging, downtime, etc.</p>
          </hgroup>
          <Oracles/>
        </section>
        <section id="liquidity">
          <h1>Liquidity</h1>
          <Liquidity/>
        </section>
        <section id="risk-parameters">
          <h1>Collateral Factor Recommendations</h1>
          <RiskParameters />
        </section>
        <section id="simulation">
          <hgroup>
            <h1> Risk Parameters Simulator</h1>
            <h3>The simulator lets you set different Supply and Borrow caps to get Collateral Factor recommendations according to different caps. The tool also provides optimization setting recommendations. </h3>
          </hgroup>
          <Simulation />
        </section>
      </ScrollSpy>
    )
  }
}

export default observer(SinglePage)