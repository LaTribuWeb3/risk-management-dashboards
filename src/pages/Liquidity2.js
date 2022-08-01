import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import SlippageChart from "../components/SlippageChart"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import {removeTokenPrefix, precentFormatter} from '../utils'
import BlockExplorerLink from '../components/BlockExplorerLink'

const usersMinWidth = '180px'

const Users = row => {
  const users = row.users.sort((a,b)=> Number(b.size) - Number(a.size))
  return <div style={{display: 'flex', width: '100%'}}>
    <details style={{padding: '0', border: 'none', marginBottom: '0', width: usersMinWidth}}>
      <summary>{precentFormatter(row.top_5)}</summary>
      <div style={{display: 'flex', flexDirection: 'column', width: usersMinWidth, }}>
        {users.map(user => {
          return <div key={user.user} style={{display: 'flex', maxWidth: '100%'}}>
              <div style={{maxWidth: '40%'}}>
                <BlockExplorerLink  address={user.user}/>
              </div>
              <div >{whaleFriendlyFormater(user.size)}</div>
            </div>
        })}
      </div>
    </details>
  </div>
}

const columns = [
  {
      name: 'LP Pair',
      selector: row => row.key,
      format: row => <b>{removeTokenPrefix(row.key)}</b>,
      minWidth: '140px'
  },    
  {
      name: 'LPs count',
      selector: row => row.count,
      format: row => row.count,
  },  
  {
      name: 'Avg LP size',
      selector: row => row.avg,
      format: row => whaleFriendlyFormater(row.avg),
  },  
  {
      name: 'Med LP size',
      selector: row => row.med,
      format: row => whaleFriendlyFormater(row.med),
  },  
  {
      name: 'Top 1 LP',
      selector: row => row.top_1,
      format: row => precentFormatter(row.top_1),
  },
  {
      name: 'Top 5 LP',
      selector: row => row.top_5,
      format: row => Users(row),
      minWidth: usersMinWidth
  },
  {
      name: 'Top 10 LP',
      selector: row => row.top_10,
      format: row => precentFormatter(row.top_10),
  },
  {
      name: 'Total liquidity ',
      selector: row => row.total,
      format: row => whaleFriendlyFormater(row.total),
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