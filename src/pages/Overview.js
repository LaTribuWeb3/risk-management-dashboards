import React, { Component } from "react";
import {observer} from "mobx-react"
import Box from "../components/Box"
import BoxGrid from "../components/BoxGrid"
import mainStore from '../stores/main.store'
import WhaleFriendly from '../components/WhaleFriendly'
import BoxRow from '../components/BoxRow'
import OverviewPieCharts from '../components/OverviewPieCharts'

const humanTxt = txt => txt.split('_').join(' ')

class Overview extends Component {
  render (){
    const rawData = Object.assign({}, mainStore['overview_data'] || {})
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }
    const loading = mainStore['overview_loading']
    const half = !loading ? parseInt(Object.entries(rawData).length / 2) : 0
    const firstHalf = !loading ? Object.entries(rawData).slice(0, half) : []
    const secondHalf = !loading ? Object.entries(rawData).slice(half) : []
    return (
      <div>
        <OverviewPieCharts/>
        <BoxGrid>
          <Box loading={loading}>
            {firstHalf.map(([k, v])=> <BoxRow key={k}>
              <div>{humanTxt(k)}</div>
              <div>$<WhaleFriendly num={v} /></div>
            </BoxRow>)}
          </Box>
          <Box loading={loading}>
            {secondHalf.map(([k, v])=> <BoxRow key={k}>
              <div>{humanTxt(k)}</div>
              <div>$<WhaleFriendly num={v} /></div>
            </BoxRow>)}
          </Box>
        </BoxGrid>
      </div>
    )
  }
}

export default observer(Overview)