import React, { Component } from "react";
import {observer} from "mobx-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const colors = [
  "#1884d8",
  "#8f84d8",
  "#8884d8",
  "#88a4d8",
  "#888fd8",
  "#888418",
  "#8884df",
]
 
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

class LiquidationsGraph extends Component {

  render (){
    const graphData = {}
    const graphKeys = {}
    Object.entries(this.props.data.graph_data).forEach(([k, v])=> {
      Object.entries(v).forEach(([x, y])=> {
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
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          {dataKeys.map((k, i)=> <Area key={i} type="monotone" dataKey={k} stackId="1" stroke={colors[i]} fill={colors[i]} />)}
        </AreaChart>
      </div>
    )
  }
}

export default observer(LiquidationsGraph)