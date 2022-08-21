import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "./Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from './WhaleFriendly'
import riskStore from '../stores/risk.store'
import Token from './Token'
import Asterisk, {hasAtLeastOneAsterisk} from './Asterisk'

const currentColumns = [
  {
      name: 'Asset',
      selector: row => row.asset,
      format: row => <Token value={row.asset}/>,
  },
  {
      name: 'Current Supply',
      selector: row => row.mint_cap,
      format: row => whaleFriendlyFormater(row.mint_cap),
      grow: 2,
  },     
  // {
  //     name: 'debug_mc',
  //     selector: row => row.debug_mc,
  //     grow: 2,
  // },   
  {
      name: 'Current Borrow',
      selector: row => row.borrow_cap,
      format: row => whaleFriendlyFormater(row.borrow_cap),
      grow: 2,
  },   
  // {
  //     name: 'debug_bc',
  //     selector: row => row.debug_bc,
  //     grow: 2,
  // },
  {
      name: 'Current Collateral Factor',
      selector: row => riskStore.getCurrentCollateralFactor(row.asset),
      width: '260px'
  },    
  {
      name: 'Recommended Collateral Factor',
      selector: row => row.collateral_factor,
      format: row => <Asterisk row={row} field={"collateral_factor"}/>,
      grow: 2,
  },
];

class RiskParametersUtilization extends Component {
  render (){
    const {loading, utilization} = riskStore
    const {json_time: currentJsonTime} = mainStore['lending_platform_current_data'] || {}
    const text = hasAtLeastOneAsterisk(utilization, "collateral_factor") ? "* if user composition will change, reduction of CF might be required to avoid bad debt." : ""
    return (
      <div>
        <Box loading={loading} time={currentJsonTime} text={text}>
          <hgroup>
            <h6>According to Current Usage</h6>
            <p >Recommended collateral factors according to current supply and borrow usage</p>
          </hgroup>
          {/* <fieldset>
            <label htmlFor="switch">
              <input onChange={riskStore.toggleLooping} value={riskStore.looping} type="checkbox" id="switch" name="switch" role="switch"/>
              <span className="nudge" data-tooltip="same asset used as debt and collateral">looping</span>
            </label>
          </fieldset> */}
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