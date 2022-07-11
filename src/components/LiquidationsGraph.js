import React, { Component } from "react";
import {observer} from "mobx-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {COLORS} from '../constants'

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
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          {dataKeys.map((k, i)=> <Area key={i} type="monotone" dataKey={k} stackId="1" stroke={COLORS[i]} fill={COLORS[i]} />)}
        </AreaChart>
      </div>
    )
  }
}

export default observer(LiquidationsGraph)