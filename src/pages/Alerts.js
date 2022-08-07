import React, { Component } from "react";
import {observer} from "mobx-react"
import Box from "../components/Box"
import BoxGrid from "../components/BoxGrid"
import alertStore from '../stores/alert.store'
import DataTable from 'react-data-table-component'
import AtRisk from '../components/AtRisk'

const Alert = props => {
  const { alert } = props
  const hasAlerts = alert.data.length || alert.negative
  const style = { 
    backgroundImage: `var(${hasAlerts ? '--icon-invalid' : '--icon-valid'})`,
    display: 'inline-block',
    minWidth: '26px',
    minHeight: '26px',
    paddingLeft: '30px',
    textTransform: 'capitalize',
  }

  const noIssues = !alert.data.length && !alert.singleMetric 
  const noDetails = alert.singleMetric
  return (
    <details className={noDetails ? "hide-details" : ""}>
      <summary>
        <div style={style}>{alert.title} </div>
        {alert.singleMetric && <span style={{marginLeft: '15px'}} data-tooltip={alert.tooltip}>{alert.singleMetric}</span>}
      </summary>
      {!!alert.data.length && <Box>
          <DataTable
            data={alert.data}
            columns={alert.columns}
            defaultSortFieldId={1}
          />
        </Box>}
      {noIssues && <kbd style={{backgroundColor: 'var(--ins-color)'}}>No Issues</kbd>}
    </details>
  )
}


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
        <AtRisk/>
        <BoxGrid>
          <Box loading={alertStore.loading}>
            <div>
              {alertStore.alerts.map((alert, i)=> <Alert key={i} alert={alert}/>)}
            </div>
          </Box>
        </BoxGrid>
      </div>
    )
  }
}

export default observer(Alerts)