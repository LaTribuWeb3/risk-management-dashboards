import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'

const columns = [
  {
      name: 'asset',
      selector: row => row.key,
      format: row => removeTokenPrefix(row.key),
      sortable: true,
  },
  {
      name: 'max_collateral',
      selector: row => row['max_collateral factor'],
      sortable: true,
  },  
  {
      name: 'max_drop',
      selector: row => row.max_drop,
      format: row => row.max_drop,
      sortable: true,
  },  
  {
      name: 'total_liquidation',
      selector: row => row.total_liquidation,
      format: row => row.total_liquidation,
      sortable: true,
  },  
];

class Oracles extends Component {
  render (){
    const loading = mainStore['current_simulation_risk_loading']
    const rawData = Object.assign({}, mainStore['current_simulation_risk_data'] || {})
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }
    const data = !loading ? Object.entries(rawData).map(([k, v])=> {
      v.key = k
      return v
    }) : []

    return (
      <div>
        <Box loading={loading}>
          {!loading && <DataTable
              columns={columns}
              data={data}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(Oracles)