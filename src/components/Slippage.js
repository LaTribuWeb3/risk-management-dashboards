import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "./Box"
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

class Slippage extends Component {
  render (){
    const market = this.props.data.key
    const loading = mainStore['usd_volume_for_slippage_loading']
    const data = !loading ? (mainStore['usd_volume_for_slippage_data']['au'+market]) : {}

    return (
      <div>
        <div loading={loading}>
          {!loading && <ExpandedComponent data={data}/>}
        </div>
      </div>
    )
  }
}

export default observer(Slippage)