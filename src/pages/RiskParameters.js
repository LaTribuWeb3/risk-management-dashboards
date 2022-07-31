import React, { Component } from "react"
import {observer} from "mobx-react"
import RiskParametersCurrent from '../components/RiskParametersCurrent'
import RiskParametersUtilization from '../components/RiskParametersUtilization'
import RiskParametersSimulation from '../components/RiskParametersSimulation'

class RiskParameters extends Component {
  render (){
    return (
      <div>
        <RiskParametersCurrent/>
        <RiskParametersUtilization/>
        <RiskParametersSimulation />
      </div>
    )
  }
}

export default observer(RiskParameters)