import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import LiquidationsGraph from '../components/LiquidationsGraph'

const columns = [
  {
      name: 'key',
      selector: row => row.key,
      sortable: true,
  },  
  {
      name: 'median_collateral',
      selector: row => row.median_collateral,
      sortable: true,
  },  
  {
      name: 'median_debt',
      selector: row => row.median_debt,
      sortable: true,
  },  
  {
      name: 'top_10_collateral',
      selector: row => row.top_10_collateral,
      sortable: true,
  },
  {
      name: 'top_10_debt',
      selector: row => row.top_10_debt,
      sortable: true,
  },
  {
      name: 'top_10_collateral',
      selector: row => row.top_10_collateral,
      sortable: true,
  },
  {
      name: 'top_1_collateral',
      selector: row => row.top_1_collateral,
      sortable: true,
  },
  {
      name: 'top_1_debt',
      selector: row => row.top_1_debt,
      sortable: true,
  },
  {
      name: 'total_collateral',
      selector: row => row.total_collateral,
      sortable: true,
  },
  {
      name: 'total_debt',
      selector: row => row.total_debt,
      sortable: true,
  },
];

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

class Accounts extends Component {
  render (){
    const loading = mainStore['accounts_loading']
    const data = !loading ? Object.entries(mainStore['accounts_data']).map(([k, v])=> {
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