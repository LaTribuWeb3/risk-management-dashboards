import React, { Component } from "react";
import {observer} from "mobx-react"
import Box from "../components/Box"
import BoxGrid from "../components/BoxGrid"
import mainStore from '../stores/main.store'
import alertStore from '../stores/alert.store'

const Alert = props => <div style={{ 
  backgroundImage: `var(${props.hasAlerts ? '--icon-invalid' : '--icon-valid'})`,
  display: 'inline-block',
  minWidth: '26px',
  minHeight: '26px',
  paddingLeft: '30px',
  textTransform: 'capitalize',
}}>{props.children}</div>

class Alerts extends Component {
  render (){

    /* 
      utilization alert
      cf alert
      oracle alert
      big accounts alert (with user addresses)
      Open liquidation
    */

    return (
      <div>
        <BoxGrid>
          <Box loading={alertStore.loading}>
            <div>
              {alertStore.alerts.map((alert, i)=> <details key={i}>
                <summary><Alert hasAlerts={alert.data.length}>{alert.title}</Alert></summary>
                {!!alert.data.length && alert.data.map((text, i)=> <p key={i}>{text}</p>)}
              </details>)}
            </div>
          </Box>
        </BoxGrid>
      </div>
    )
  }
}

export default observer(Alerts)