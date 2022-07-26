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
      name: '',
      selector: row => row.asset,
      format: row => removeTokenPrefix(row.asset),
  },
  {
      name: 'Mint Cap',
      selector: row => row.mint_cap,
      format: row => whaleFriendlyFormater(row.mint_cap),
      grow: 2,
  },  
  // {
  //   name: 'M C',
  //   selector: row => row.debug_mc,
  // },  
  {
      name: 'Borrow Cap',
      selector: row => row.borrow_cap,
      format: row => whaleFriendlyFormater(row.borrow_cap),
      grow: 2,
  },
  // {
  //   name: 'B C',
  //   selector: row => row.debug_bc,
  // },
  {
      name: 'Collateral Factor (current)',
      selector: row => row.collateral_factor,
      format: row => <Cf row={row}/>,
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
          <h6>Current Risk Parameters Utilization</h6>
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