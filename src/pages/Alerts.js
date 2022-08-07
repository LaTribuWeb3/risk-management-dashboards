import React, { Component } from "react";
import {observer} from "mobx-react"
import Box from "../components/Box"
import BoxGrid from "../components/BoxGrid"
import alertStore from '../stores/alert.store'
import DataTable from 'react-data-table-component'
import AtRisk from '../components/AtRisk'

const AlertText = props => {
  const { type, hasAlerts } = props
  const style = { 
    display: 'inline-block',
    minWidth: '26px',
    minHeight: '26px',
    paddingLeft: '30px',
    textTransform: 'capitalize',
  }
  if(type === 'healthy'){
    style.backgroundImage = `var(--icon-valid)`
  }
  if (type === 'review'){
    style.backgroundImage = `url('icons/exclamation-triangle.svg')`
  }
  if(type === 'action required'){
    style.backgroundImage = `var(--icon-invalid)`
  }
  return (<div style={style}>{props.children}</div>)
}

const Alert = props => {
  const { alert } = props
  const hasAlerts = alert.data.length || alert.negative

  return (
    <details>
      <summary>
        <AlertText type={alert.type}>{alert.title}</AlertText>
      </summary>
      {alert.type === 'healthy' && <kbd style={{backgroundColor: 'var(--ins-color)'}}>No Issues</kbd>}
      {alert.type === 'danger' && <a href={alert.link} ><kbd style={{backgroundColor: 'var(--red-text)'}}>Action Required</kbd></a>}
      {alert.type === 'review' && <a href={alert.link} ><kbd style={{backgroundColor: 'var(--yellow-text)'}}>Review</kbd></a>}
      {alert.showTable && !!alert.data.length && <Box>
          <DataTable
            data={alert.data}
            columns={alert.columns}
            defaultSortFieldId={1}
          />
        </Box>}
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