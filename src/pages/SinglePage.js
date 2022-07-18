import React, { Component } from "react";
import {observer} from "mobx-react"
import Overview from './Overview'
import Liquidity from './Liquidity'
import Accounts from "./Accounts";
import Oracles from "./Oracles";
import RiskParameters from "./RiskParameters";
import Simulation from "./Simulation";
import ScrollSpy from "react-ui-scrollspy";


class SinglePage extends Component {

  render (){
    return (
      <ScrollSpy offsetBottom={200} scrollThrottle={100} parentScrollContainerRef={this.props.scrollContainer}>
        <section id="overview">
          <h1 >Overview</h1>
          <Overview/>
        </section>
        <section id="accounts">
          <h1>Accounts</h1>
          <Accounts/>      
        </section>
        <section  id="oracles">
          <h1>Oracles</h1>
          <Oracles/>
        </section>
        <section id="liquidity">
          <h1>Liquidity</h1>
          <Liquidity/>
        </section>
        <section id="risk-parameters">
          <h1>Risk Parameters</h1>
          <RiskParameters />
        </section>
        <section id="simulation">
          <hgroup>
            <h1 >Current State</h1>
            <h3>Worse day simulation on current state</h3>
          </hgroup>
          <Simulation />
        </section>
      </ScrollSpy>
    )
  }
}

export default observer(SinglePage)