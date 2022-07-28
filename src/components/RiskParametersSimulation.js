import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "./Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from './WhaleFriendly'
import {removeTokenPrefix} from '../utils'

const columns = [
  {
      name: 'Asset',
      selector: row => row.key,
      format: row => removeTokenPrefix(row.key),
      sortable: true,
  },
  {
    name: 'Total Liquidations',
    selector: row => row.total_liquidation,
    format: row => whaleFriendlyFormater(row.total_liquidation),
    sortable: true,
  },  
  {
    name: 'Bad Debt Accrued',
    selector: row => row.max_drop,
    format: row => row.max_drop,
    sortable: true,
  },      
  {
      name: 'Max Collateral Factor',
      selector: row => row['max_collateral'],
      sortable: true,
  },  
];

class RiskParametersSimulation extends Component {
  render (){
    const loading = mainStore['current_simulation_risk_loading']
    const rawData = Object.assign({}, mainStore['current_simulation_risk_data'] || {})
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }
    const data = !loading ? Object.entries(rawData).map(([k, v])=> {
      return Object.assign({ key: k}, v.summary)
    }) : []
    return (
      <div>
        <Box loading={loading}  time={json_time}>
          <hgroup>
            <h6>According to Worst Day Scenario</h6>
            <p>Worst day simulation is done according to the worst day price-drop in ETH history. Other assets are being normalized according to their volatility compared to ETH. The simulation takes into consideration the current collateral factors and current users’ usage to present total liquidations and bad debt that would have accrued in the platform. The Max CF is the highest collateral factor that won’t create bad debt for the platform in case the same scenario repeats today</p>
          </hgroup>
          {!loading && <DataTable
              columns={columns}
              data={data}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(RiskParametersSimulation)
