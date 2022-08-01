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
      name: 'LP Pair',
      selector: row => row.key,
      format: row => <b>{removeTokenPrefix(row.key)}</b>,
      sortable: true,
      grow: 2
  },    
  {
      name: 'LPs count',
      selector: row => row.count,
      format: row => row.count,
      sortable: true,
  },  
  {
      name: 'Avg LP size',
      selector: row => row.avg,
      format: row => whaleFriendlyFormater(row.avg),
      sortable: true,
  },  
  {
      name: 'Med LP size',
      selector: row => row.med,
      format: row => whaleFriendlyFormater(row.med),
      sortable: true,
  },  
  {
      name: 'Top 1 LP',
      selector: row => row.top_1,
      format: row => precentFormatter(row.top_1),
      sortable: true,
  },
  {
    name: 'Top 5 LP',
    selector: row => row.top_5,
    format: row => precentFormatter(row.top_5),
    sortable: true,
  },
  {
      name: 'Top 10 LP',
      selector: row => row.top_10,
      format: row => precentFormatter(row.top_10),
      sortable: true,
  },
  {
      name: 'Total liquidity ',
      selector: row => row.total,
      format: row => whaleFriendlyFormater(row.total),
      sortable: true,
  }
];

class Liquidity extends Component {
  render (){
    const loading = mainStore['dex_liquidity_loading']
    const assets = {}
    const rawData = Object.assign({}, mainStore['dex_liquidity_data'] || {})
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }
    Object.entries(rawData).map(([k, v])=> {
      const asset = k.split('-')[0]
      assets[asset] = assets[asset] || { name: asset, lps: []}
      v.key = k
      assets[asset].lps.push(v)
    })
    return (
      <div>
        <Box loading={loading} time={json_time}>
          {Object.values(assets).map((asset, i)=><details key={i} open>
            <summary><b>{asset.name}</b></summary>
            <div style={{display: 'flex'}}>
              <SlippageChart data={asset.name} i={i}/>
            </div>
            <div style={{marginLeft: '30px'}}>
              <Box>
                  <DataTable
                    columns={columns}
                    data={asset.lps}
                  />
              </Box>
            </div>
          </details>)}
        </Box>
      </div>
    )
  }
}

export default observer(Liquidity)