import React, { Component } from "react";
import {observer} from "mobx-react"
import mainStore from '../stores/main.store'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {COLORS} from '../constants'
import {removeTokenPrefix} from '../utils'

class SlippageChart extends Component {

  render (){
    debugger
    const market = this.props.data.key
    const loading = mainStore['usd_volume_for_slippage_loading']
    const rawData = mainStore['usd_volume_for_slippage_data'] || {}
    const data = !loading ? (rawData['au'+market] || {}) : {}
    const dataSet = Object.entries(data).map(([k, v])=> ({name: removeTokenPrefix(k), value: v}))
    if(!dataSet.length){
      return null
    }
   debugger
    return (
      <div>
        <BarChart 
          width={1000}
          height={400}
          data={dataSet}
          margin={{
            top: 10,
            right: 30,
            left: 50,
            bottom: 0,
          }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill={COLORS[0]} />
        </BarChart>
      </div>
    )
  }
}

export default observer(SlippageChart)