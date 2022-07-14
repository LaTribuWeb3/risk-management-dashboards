import React, { Component } from "react";
import {observer} from "mobx-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import {COLORS} from '../constants'
import mainStore from '../stores/main.store'
import {removeTokenPrefix} from '../utils'
import {WhaleFriendlyAxisTick} from '../components/WhaleFriendly'

class LiquidationsGraph extends Component {

  render (){
    const graphData = {}
    const graphKeys = {}
    Object.entries(this.props.data.graph_data).forEach(([k, v])=> {
      Object.entries(v).forEach(([x, y])=> {
        y = parseFloat(y).toFixed(2)
        x = parseFloat(x).toFixed(2)
        graphData[x] = graphData[x] || {}
        graphData[x][k] = y
        graphData[x].x = parseFloat(x)
        graphKeys[k] = k
      })
    })
    const dataKeys = Object.keys(graphKeys)
    const dataSet = Object.values(graphData).sort((a, b) => a.x - b.x)

    const loading = mainStore['oracles_loading']
    const rawData = Object.assign({}, mainStore['oracles_data'] || {})
    debugger
    const asset = this.props.data.key
    const currentPrice = (rawData[asset] || {}).oracle
    return (
      <div>
        <AreaChart
          width={1000}
          height={400}
          data={dataSet}
          margin={{
            top: 10,
            right: 30,
            left: 30,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {currentPrice && <ReferenceLine alwaysShow={true} x={currentPrice} label={`${removeTokenPrefix(asset)} price`} stroke="var(--primary" />}
          {/* <ReferenceLine y={650000} label="Max" stroke="red" /> */}
          <XAxis type="number" dataKey="x" />
          <YAxis tick={<WhaleFriendlyAxisTick />}/>
          <Tooltip />
          {dataKeys.map((k, i)=> <Area key={i} type="monotone" dataKey={k} stackId="1" stroke={COLORS[i]} fill={COLORS[i]} />)}
        </AreaChart>
      </div>
    )
  }
}

export default observer(LiquidationsGraph)