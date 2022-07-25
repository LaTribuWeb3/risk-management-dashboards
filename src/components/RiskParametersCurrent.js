import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "./Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from './WhaleFriendly'
import {removeTokenPrefix} from '../utils'
import riskStore from '../stores/risk.store'
import {Cf} from './CfDiff'

const currentCapFormater = num => {
  if (num === '0') {
    return '∞';
  }
  return whaleFriendlyFormater(num)
}

const currentColumns = [
  {
      name: '',
      selector: row => row.asset,
      format: row => removeTokenPrefix(row.asset),
  },
  {
      name: 'Mint Cap',
      selector: row => row.mint_cap,
      format: row => currentCapFormater(row.mint_cap)
  },  
  {
      name: 'Borrow Cap',
      selector: row => row.borrow_cap,
      format: row => currentCapFormater(row.borrow_cap)
  },
  {
      name: 'Collateral Factor',
      selector: row => row.collateral_factor,
      format: row => <Cf row={row}/>,
  },
];

class RiskParametersCurrent extends Component {
  render (){
    const {loading, currentData} = riskStore
    const {json_time: currentJsonTime} = mainStore['lending_platform_current_data'] || {}
    return (
      <div>
        <Box loading={loading} time={currentJsonTime}>
          <h6>Current Risk Parameters</h6>
          {!loading && <DataTable
              columns={currentColumns}
              data={currentData}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(RiskParametersCurrent)