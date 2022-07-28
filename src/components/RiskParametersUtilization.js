import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "./Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from './WhaleFriendly'
import {removeTokenPrefix} from '../utils'
import riskStore from '../stores/risk.store'
import {Cf} from './CfDiff'

const currentColumns = [
  {
      name: 'Asset',
      selector: row => row.asset,
      format: row => removeTokenPrefix(row.asset),
  },
  {
      name: 'Current Supply',
      selector: row => row.mint_cap,
      format: row => whaleFriendlyFormater(row.mint_cap),
      grow: 2,
  },   
  {
      name: 'Current Borrow',
      selector: row => row.borrow_cap,
      format: row => whaleFriendlyFormater(row.borrow_cap),
      grow: 2,
  },
  {
      name: 'Current Collateral Factor',
      selector: row => riskStore.getCurrentCollateralFactor(row.asset),
      width: '260px'
  },    
  {
      name: 'Recommended Collateral Factor',
      selector: row => row.collateral_factor,
      format: row => row.collateral_factor.toFixed(2),
      grow: 2,
  },
];

class RiskParametersUtilization extends Component {
  render (){
    const {loading, utilization} = riskStore
    const {json_time: currentJsonTime} = mainStore['lending_platform_current_data'] || {}
    return (
      <div>
        <Box loading={loading} time={currentJsonTime}>
          <hgroup>
            <h6>According to Current Usage</h6>
            <p>Recommended collateral factors according to current supply and borrow usage</p>
          </hgroup>
          {!loading && <DataTable
              columns={currentColumns}
              data={utilization}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(RiskParametersUtilization)