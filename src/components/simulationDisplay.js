import React from "react";
import { observer } from "mobx-react";

class simulationDisplay extends React.Component {
  render() {
    const { row } = this.props;
    return <span>{row.simulationLT}</span>;
  }
}

export default observer(simulationDisplay);
