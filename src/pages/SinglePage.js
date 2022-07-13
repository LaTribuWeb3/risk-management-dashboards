import React, { Component } from "react";
import {observer} from "mobx-react"

import Backstop from './Backstop'
import Overview from './Overview'
import Liquidity from './Liquidity'
import Accounts from "./Accounts";
import Oracles from "./Oracles";
import RiskParameters from "./RiskParameters";
import Simulation from "./Simulation";

class SinglePage extends Component {
  render (){
    return (
      <div>
        <h1 id="overview">Overview</h1>
        <Overview/>
        <h1 id="accounts">Accounts</h1>
        <Accounts/>        
        <h1 id="oracles">Oracles</h1>
        <Oracles/>
        {/* <h1 id="backstop">Backstop</h1>
        <Backstop/> */}
        <h1 id="liquidity">Liquidity</h1>
        <Liquidity/>
        <h1 id="risk-parameters">Risk Parameters</h1>
        <RiskParameters />
        <hgroup>
          <h1 id="simulation">Current State</h1>
          <h3>Worse day simulation on current state</h3>
        </hgroup>
        <Simulation />
      </div>
    )
  }
}

export default observer(SinglePage)