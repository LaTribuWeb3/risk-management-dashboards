import React, { Component, PureComponent } from "react";
import {observer} from "mobx-react"
import mainStore from '../stores/main.store'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import {COLORS, BLOCK_EXPLORER} from '../constants'
import {removeTokenPrefix} from '../utils'
import {whaleFriendlyFormater, WhaleFriendlyAxisTick} from '../components/WhaleFriendly'
import BoxRow from "./BoxRow";
import { TOKEN_PREFIX } from "../constants";

const truncate = {
  maxWidth: '200px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const expendedBoxStyle = {margin: '30px', width: '50%', minHeight: '300px'}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const {name, value} = Object.assign({}, payload[0].payload)
    return (
      <div className="tooltip-container">
        <BoxRow>
          <div>{name}</div>
          <div>{whaleFriendlyFormater(value)}</div>
        </BoxRow>
      </div>
    );
  }
}

class SlippageChart extends Component {

  render (){
    let market = this.props.data.key.split('-')[0]
    if (market === 'WETH'){
      market = 'ETH'
    }
    const {users} = this.props.data || []
    const loading = mainStore['usd_volume_for_slippage_loading']
    const rawData = Object.assign({}, mainStore['usd_volume_for_slippage_data'] || {})
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }
    const data = !loading ? (rawData[TOKEN_PREFIX + market] || {}) : {}
    const dataSet = Object.entries(data).map(([k, v])=> ({name: removeTokenPrefix(k), value: v}))
    if(!dataSet.length){
      return null
    }
    const [biggest, secondBiggest] = dataSet.sort((a, b)=> b.value - a.value)
    const dataMax = Math.min(secondBiggest.value * 2, biggest.value)
    return (
      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
        <div>{dataMax}</div>  
        <article style={expendedBoxStyle}>
        <ResponsiveContainer>
          <BarChart data={dataSet}>
            <XAxis dataKey="name" />
            <YAxis type="number" domain={['dataMin', dataMax]} tick={<WhaleFriendlyAxisTick />} allowDataOverflow={true}/>
            <Tooltip content={CustomTooltip}/>
            <Bar dataKey="value" fill={COLORS[0]} />
          </BarChart>
          </ResponsiveContainer>
        </article>
        <article style={expendedBoxStyle}>
          <h6>top 5 accounts</h6>
          <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
            {users.map(({user, size}, i)=> <BoxRow key={i}>
              <a target="_blank" href={`${BLOCK_EXPLORER}/address/${user}`} style={truncate}>{user}</a>
              <span className="data-text" >${whaleFriendlyFormater(size)}</span>
            </BoxRow>
            )}
          </div>
        </article>
      </div>
    )
  }
}

export default observer(SlippageChart)