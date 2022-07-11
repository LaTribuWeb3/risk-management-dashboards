import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'

const columns = [
  {
      name: 'key',
      selector: row => row.key,
      sortable: true,
  },  
  {
      name: 'cex_price',
      selector: row => row.cex_price,
      sortable: true,
  },  
  {
      name: 'dex_price',
      selector: row => row.dex_price,
      sortable: true,
  },  
  {
      name: 'oracle',
      selector: row => row.oracle,
      sortable: true,
  },
];

const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

class Oracles extends Component {
  render (){
    const loading = mainStore['oracles_loading']
    const data = !loading ? Object.entries(mainStore['oracles_data']).map(([k, v])=> {
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