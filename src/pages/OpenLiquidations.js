import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {removeTokenPrefix} from '../utils'
import riskStore from '../stores/risk.store'
import BlockExplorerLink from "../components/BlockExplorerLink"
import {whaleFriendlyFormater} from "../components/WhaleFriendly"

const columns = [
  {
    name: 'User',
    selector: row => row.account,
    format: row => <BlockExplorerLink address={row.account}/>,
    sortable: true,
  },
  {
    name: 'Debt Size',
    selector: row => whaleFriendlyFormater(row.user_debt_wo_looping),
    sortable: true,
  },
  {
    name: 'Collateral Size',
    selector: row => whaleFriendlyFormater(row.user_collateral_wo_looping),
    sortable: true,
  },
]

const expendedBoxStyle = {margin: '30px', width: '100%', minHeight: '100px', padding: '30px'}

const humanizeRecommendation = r => {
  const rItems = r.split(' ')
  rItems[1] = removeTokenPrefix(rItems[1])
  if(rItems[2] === 'mint'){
    rItems[2] = 'supply'
  }
  return rItems.join(' ')
}

const Recommendation = (props) => {
  let recommendations = []
  riskStore.recommendations.forEach(r=> {
    if(r.asset === props.data.asset){
      recommendations.push(r.recommendation)
    }
  })
  recommendations = [... new Set(recommendations)]
  return <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
    <article style={expendedBoxStyle}>
      <h6>to improve collateral factor</h6>
      {recommendations.map(r=> <div key={r}>
        <a onClick={()=>riskStore.preformRecommendation(r)}>
          {humanizeRecommendation(r)}
        </a>
      </div>)}
    </article>
  </div>
}

class OpenLiquidations extends Component {
  render (){
    const {loading} = mainStore['open_liquidations_loading']
    const rawData = Object.assign({}, mainStore['open_liquidations_data'] || {})
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }
    const {data} = rawData
    return (
      <div>
        <Box loading={loading} time={json_time}>
          {!loading && <DataTable
              columns={columns}
              data={data}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(OpenLiquidations)