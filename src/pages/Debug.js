import React, { Component } from "react"
import { observer } from "mobx-react"
import poolsStore from '../stores/pools.store'
import { makeAutoObservable, runInAction } from "mobx"




class Debug extends Component {
    render() {
        const rawData = poolsStore['pools_data'];
        return(
            <div>
        <pre>{JSON.stringify(rawData, null, 2)}</pre>
        </div>
        )
    }
}

export default observer(Debug)
