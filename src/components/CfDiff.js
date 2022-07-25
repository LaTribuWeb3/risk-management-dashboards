import React, {useState} from "react";
import {observer} from "mobx-react"
import ReactTooltip from 'react-tooltip';
import riskStore from '../stores/risk.store'
import Ramzor from './Ramzor'

export const Cf = props => {
  const cf = (props.row.collateral_factor || 0).toFixed(2)
  const currentCollateralFactor = riskStore.getCurrentCollateralFactor(props.row.asset)
  return <div>
    <abbr> {cf} </abbr>
    <span> ({currentCollateralFactor}) </span>
  </div>
}

class CfDiff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: true,
    };
  }

  render () {
    const recommendations = []
    riskStore.recommendations.forEach(r=> {
      if(r.asset === this.props.row.asset){
        recommendations.push(r.recommendation)
      }
    })
    const currentCollateralFactor = riskStore.getCurrentCollateralFactor(this.props.row.asset)
    const recommendation = recommendations.join('\n Or ')
    const cf = (this.props.row.collateral_factor || 0).toFixed(2)
    const diff = this.props.row.diff
    return (<React.Fragment>
      <abbr
          className={`transition ${diff ? 'highlight' : ''}`}
          onMouseEnter={() => {
            console.log('enter')
            this.setState({tooltip: true});
            console.log(this.state)
          }}
          onMouseLeave={() => {
            console.log('leave')
            this.setState({tooltip: false});
            console.log(this.state)
            setTimeout(() => this.setState({tooltip: true}), 1000)
          }}
        data-tip={recommendation}>
        {cf} 
      </abbr>
      <span> ({currentCollateralFactor}) </span>
      {diff && <Ramzor red={diff < 0}> ({diff.toFixed(2)})</Ramzor>}
      {this.state.tooltip && <ReactTooltip textColor='var(--tooltip-color)' backgroundColor='var(--tooltip-background-color)' effect="solid"/>}
    </React.Fragment>)
  }
}

export default observer(CfDiff)