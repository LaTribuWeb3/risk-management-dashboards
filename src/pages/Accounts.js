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
      name: 'asset',
      selector: row => row.key,
      format: row => removeTokenPrefix(row.key),
      sortable: true,
  },  
  {
      name: 'median_collateral',
      selector: row => whaleFriendlyFormater(row.median_collateral),
      sortable: true,
  },  
  {
      name: 'median_debt',
      selector: row => whaleFriendlyFormater(row.median_debt),
      sortable: true,
  },  
  {
      name: 'top_10_collateral',
      selector: row => whaleFriendlyFormater(row.top_10_collateral),
      sortable: true,
  },
  {
      name: 'top_10_debt',
      selector: row => whaleFriendlyFormater(row.top_10_debt),
      sortable: true,
  },
  {
      name: 'top_10_collateral',
      selector: row => whaleFriendlyFormater(row.top_10_collateral),
      sortable: true,
  },
  {
      name: 'top_1_collateral',
      selector: row => whaleFriendlyFormater(row.top_1_collateral),
      sortable: true,
  },
  {
      name: 'top_1_debt',
      selector: row => whaleFriendlyFormater(row.top_1_debt),
      sortable: true,
  },
  {
      name: 'total_collateral',
      selector: row => whaleFriendlyFormater(row.total_collateral),
      sortable: true,
  },
  {
      name: 'total_debt',
      selector: row => whaleFriendlyFormater(row.total_debt),
      sortable: true,
  },
];

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

class Accounts extends Component {
  render (){
    const loading = mainStore['accounts_loading']
    const rawData = mainStore['accounts_data'] || {}
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
              expandableRows
              columns={columns}
              data={data}
              expandableRowsComponent={LiquidationsGraph}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(Accounts)