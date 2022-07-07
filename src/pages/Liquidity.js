import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import Slippage from "../components/Slippage"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'

const columns = [
  {
      name: 'key',
      selector: row => row.key,
      sortable: true,
  },  
  {
      name: 'avg',
      selector: row => row.avg,
      sortable: true,
  },  
  {
      name: 'med',
      selector: row => row.med,
      sortable: true,
  },  
  {
      name: 'top_1',
      selector: row => row.top_1,
      sortable: true,
  },
  {
      name: 'top_10',
      selector: row => row.top_10,
      sortable: true,
  },
  {
      name: 'top_5',
      selector: row => row.top_5,
      sortable: true,
  },
  {
      name: 'total',
      selector: row => row.total,
      sortable: true,
  }
];



const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

class Liquidity extends Component {
  render (){
    const loading = mainStore['dex_liquidity_loading']
    const data = !loading ? Object.entries(mainStore['dex_liquidity_data']).map(([k, v])=> {
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
              expandableRowsComponent={Slippage}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(Liquidity)