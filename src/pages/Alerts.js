import React, { Component } from "react";
import {observer} from "mobx-react"
import Box from "../components/Box"
import BoxGrid from "../components/BoxGrid"
import mainStore from '../stores/main.store'
import WhaleFriendly from '../components/WhaleFriendly'
import BoxRow from '../components/BoxRow'
import OverviewPieCharts from '../components/OverviewPieCharts'

const humanTxt = txt => txt.split('_').join(' ')

const Alert = props => <div style={{ 
  backgroundImage: 'var(--icon-invalid)',
  display: 'inline-block',
  minWidth: '26px',
  minHeight: '26px',
  paddingLeft: '30px'
}}>{props.children}</div>

class Alerts extends Component {
  render (){
    const rawData = Object.assign({}, mainStore['overview_data'] || {})
    const loading = mainStore['overview_loading']
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }

    /* 
      utilization alert
      cf alert
      oracle alert
      big accounts alert (with user addresses)
      Open liquidation

    */
    const alerts = [
      { 
        title: "utilization alert",
        details: "details"
      },
      { 
        title: "collateral factor alert",
        details: "details"
      },
      { 
        title: "oracle alert",
        details: "details"
      },
      { 
        title: "ongoing liquidations",
        details: "details"
      },
    ]
    return (
      <div>
        <BoxGrid>
          <Box loading={loading} time={json_time}>
            <div>
              {alerts.map((alert, i)=> <details key={i}>
                <summary><Alert>{alert.title}</Alert></summary>
                <p>{alert.details}</p>
              </details>)}
            </div>
          </Box>
        </BoxGrid>
      </div>
    )
  }
}

export default observer(Alerts)