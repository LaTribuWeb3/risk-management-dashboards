import React from "react"
import {observer} from "mobx-react"
import mainStore from "../stores/main.store"
import poolsStore from "../stores/pools.store"




const Tabnav = (props) => {
  const loading = poolsStore['pools_loading'];
  const rawData = poolsStore['pools_data'];
  



  return (
    <div className="tabnav">
      {loading ? <text>loading...</text> : rawData.map((pool, i) => {
        return <button key={i}>{pool['address']}</button>
      })
      }

    </div>
  )
}

export default observer(Tabnav)