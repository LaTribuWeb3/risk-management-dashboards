import { Component } from "react";
import RiskParametersSimulation from "../components/RiskParametersSimulation";
import RiskParametersUtilization from "../components/RiskParametersUtilization";
import { observer } from "mobx-react";

class RiskParameters extends Component {
  render() {
    return (
      <div>
        <RiskParametersSimulation />
        <RiskParametersUtilization />
      </div>
    );
  }
}

export default observer(RiskParameters);
