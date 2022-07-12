import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import SlippageChart from "../components/SlippageChart"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import {removeTokenPrefix, precentFormatter} from '../utils'

const columns = [
  {
      name: 'asset',
      selector: row => row.key,
      format: row => removeTokenPrefix(row.key),
      sortable: true,
  },    
  {
      name: 'count',
      selector: row => row.count,
      format: row => row.count,
      sortable: true,
  },  
  {
      name: 'avg',
      selector: row => row.avg,
      format: row => whaleFriendlyFormater(row.avg),
      sortable: true,
  },  
  {
      name: 'med',
      selector: row => row.med,
      format: row => whaleFriendlyFormater(row.med),
      sortable: true,
  },  
  {
      name: 'top_1',
      selector: row => row.top_1,
      format: row => precentFormatter(row.top_1),
      sortable: true,
  },
  {
    name: 'top_5',
    selector: row => row.top_5,
    format: row => precentFormatter(row.top_5),
    sortable: true,
  },
  {
      name: 'top_10',
      selector: row => row.top_10,
      format: row => precentFormatter(row.top_10),
      sortable: true,
  },
  {
      name: 'total',
      selector: row => row.total,
      format: row => whaleFriendlyFormater(row.total),
      sortable: true,
  }
];

class Liquidity extends Component {
  render (){
    const loading = mainStore['dex_liquidity_loading']
    
    const rawData = Object.assign({}, mainStore['dex_liquidity_data'] || {})
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
              expandableRowsComponent={SlippageChart}
              expandableRowExpanded={()=> true}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(Liquidity)