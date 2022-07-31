import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import LiquidationsGraph from '../components/LiquidationsGraph'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import {removeTokenPrefix} from '../utils'

const columns = [
  {
      name: 'Asset',
      selector: row => row.key,
      format: row => removeTokenPrefix(row.key),
      sortable: true,
      minWidth: '110px'
  },  
  {
      name: 'Total Collateral',
      selector: row =>  Number(row.total_collateral),
      format: row => whaleFriendlyFormater(row.total_collateral),
      sortable: true,
      minWidth: '140px'
  },
  {
      name: 'Total Debt',
      selector: row => Number(row.total_debt),
      format: row => whaleFriendlyFormater(row.total_debt),
      sortable: true,
      minWidth: '110px'
  },
  {
      name: 'Median Collateral',
      selector: row =>  Number(row.median_collateral),
      format: row => whaleFriendlyFormater(row.median_collateral),
      sortable: true,
      minWidth: '140px'
  },  
  {
      name: 'Median Debt',
      selector: row =>  Number(row.median_debt),
      format: row => whaleFriendlyFormater(row.median_debt),
      sortable: true,
      minWidth: '120px'
  },  
  {
      name: 'Top 10 Accounts Collateral',
      selector: row =>  Number(row.top_10_collateral),
      format: row => whaleFriendlyFormater(row.top_10_collateral),
      sortable: true,
      minWidth: '140px'
  },
  {
      name: 'Top 10 Accounts Debt',
      selector: row =>  Number(row.top_10_debt),
      format: row => whaleFriendlyFormater(row.top_10_debt),
      sortable: true,
      minWidth: '140px'
  },
  {
      name: 'Top 1 Account Collateral',
      selector: row =>  Number(row.top_1_collateral),
      format: row => whaleFriendlyFormater(row.top_1_collateral),
      sortable: true,
      minWidth: '140px'
  },
  {
      name: 'Top 1 Account Debt',
      selector: row =>  Number(row.top_1_debt),
      format: row => whaleFriendlyFormater(row.top_1_debt),
      sortable: true,
      minWidth: '140px'
  },
]

const rowPreExpanded = row => row.defaultExpanded
  
class Accounts extends Component {
  render (){
    const loading = mainStore['accounts_loading']
    const rawData = mainStore['accounts_data'] || {}
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }
    const data = !loading ? Object.entries(rawData)
    .map(([k, v])=> {
      v.key = k
      return v
    })
    .sort((a, b)=> {
      return b.total_collateral - a.total_collateral
    }) : []

    if(data.length){
      data[0].defaultExpanded = true  
    }
    
    return (
      <div>
        <Box loading={loading} time={json_time}>
          {!loading && <DataTable
              expandableRows
              columns={columns}
              defaultSortFieldId={2}
              defaultSortAsc={false}
              data={data}
              expandableRowsComponent={LiquidationsGraph}
              expandableRowExpanded={rowPreExpanded}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(Accounts)