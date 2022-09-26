import React, { useEffect } from "react"
import {observer} from "mobx-react"
import poolsStore from "../stores/pools.store"
import { tokenName } from "../utils"



const Tabnav = (props) => {
  const loading = poolsStore['pools_loading'] || poolsStore['data/tokens?fakeMainnet=0_loading'];
  const rawData = poolsStore['pools_data'];
  



  return (
    <div className="tabnav">
      {loading ? <text>loading...</text> : rawData.map((pool, i) => {
        return <button key={i}>{tokenName(pool['underlying'])}</button>
      })
      }
    </div>
  )
}

export default observer(Tabnav)