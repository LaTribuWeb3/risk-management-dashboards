import React, { useEffect, Component } from "react"
import {observer} from "mobx-react"
import poolsStore from "../stores/pools.store"
import { tokenName } from "../utils"

const Tabnav = (props) => {
// class Tabnav extends Component {
  // render (){
  const loading = poolsStore['pools_loading'] || poolsStore['data/tokens?fakeMainnet=0_loading'];
  const poolsData = Object.assign([], poolsStore['pools_data'] || []);
  const tokenData = Object.assign([], poolsStore['data/tokens?fakeMainnet=0_data'] || []);
  
  return (
    <div className="tabnav">
    <select>
      {loading ? <span>loading pools...</span> : poolsData.map((pool, i) => {
          const symbol = tokenData.find(t => t.address === pool.underlying)?.symbol;
          return <option key={i} value={symbol} selected= {i === 0}>{symbol + ' pool'}</option>
      })
    }
    </select>
    </div>
  )
}
// }

export default observer(Tabnav)