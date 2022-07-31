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
  if (num === Infinity) {
    return '∞';
  }
  return whaleFriendlyFormater(num)
}

const currentColumns = [
  {
      name: 'Asset',
      selector: row => row.asset,
      format: row => <b>{removeTokenPrefix(row.asset)}</b>,
  },
  {
      name: 'Supply Cap',
      selector: row => row.mint_cap,
      format: row => currentCapFormater(row.mint_cap),
  },    

  {
      name: 'Borrow Cap',
      selector: row => row.borrow_cap,
      format: row => currentCapFormater(row.borrow_cap),
  },
  {
      name: 'Current Collateral Factor',
      selector: row => riskStore.getCurrentCollateralFactor(row.asset),
  },  
  {
      name: 'Recommended Collateral Factor',
      selector: row => row.collateral_factor,
      format: row => row.collateral_factor.toFixed(2),
  },
];

class RiskParametersCurrent extends Component {
  render (){
    const {loading, currentData} = riskStore
    const {json_time: currentJsonTime} = mainStore['lending_platform_current_data'] || {}
    return (
      <div>
        <Box loading={loading} time={currentJsonTime}>
          <hgroup>
            <h6>According to Existing Caps</h6>
            <p className="description">Recommended collateral factors according to existing supply and borrow caps set by the platform.</p>
          </hgroup>
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