import React, {useState} from "react";
import {observer} from "mobx-react"
import ReactTooltip from 'react-tooltip';
import riskStore from '../stores/risk.store'

class Recomendation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tooltip: true};
  }

  render () {
    const recomendations = []
    riskStore.recomendations.forEach(r=> {
      if(r.asset === this.props.row.asset){
        recomendations.push(r.recommendation)
      }
    })
    const recomendation = recomendations.join('\n Or ')
    return (<React.Fragment>
      <abbr
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
        data-tip={recomendation}>
        {this.props.children}
      </abbr>  
      <span>{this.state.tooltip}</span>
      {this.state.tooltip && <ReactTooltip effect="solid"/>}
    </React.Fragment>)
  }
}

export default observer(Recomendation)