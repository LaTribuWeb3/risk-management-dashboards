import React, { Component, Fragment } from "react";
import {observer} from "mobx-react"
const tenth = 100

export const whaleFriendlyFormater = num => {
  if (isNaN(num)){
    // not a numerical string
    return num
  } else {
    num = parseFloat(num)
  }
  debugger
  let wfn
    if(num === 0) {
      wfn = '0'
    } else if(!num){
      wfn = 'N/A'
    }else if(num  <= tenth) {
      wfn = Number(num.toFixed(2))
    }else if(num / 1000 <= tenth) {
      wfn = Number((num / 1000).toFixed(2)) + 'K'
    } else if(num / 1000000 <= tenth) {
      wfn = Number((num / 1000000).toFixed(2)) + 'M'
    } else {
      wfn = Number((num / 1000000000).toFixed(2)) + 'B'
    }
    return wfn
}

class WhaleFriendly extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    let wfn = whaleFriendlyFormater(this.props.num)
    return (
      <Fragment>
        {wfn}
      </Fragment>
    )
  }
}

export default observer(WhaleFriendly);