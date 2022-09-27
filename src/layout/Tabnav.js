import React, {Component} from "react"
import {observer} from "mobx-react"
import poolsStore from "../stores/pools.store"
import alertStore from '../stores/alert.store'
import mainStore from "../stores/main.store"

// const Tabnav = (props) => {
class Tabnav extends Component {
  render (){
    const loading = poolsStore['data/tokens?fakeMainnet=0_loading'] || poolsStore['pools_loading'];
    const poolsData = Object.assign([], poolsStore['pools_data'] || []);
    const tokenData = Object.assign([], poolsStore['data/tokens?fakeMainnet=0_data'] || []);
    
    function onPoolSelect(event) {
      const selectedLabel = event.target.selectedOptions[0].label;
      const poolAddress = event.target.selectedOptions[0].value;
      alertStore.valueAtRisk = poolAddress;

      // mainStore['account_data'] = poolsStore['pool_data']['0x7407180AE470113761d3EC99Aa973cf8Bd127c68'];

      if(selectedLabel.includes('DAI')) {
        alertStore.liquidationsAtRisk = 100;
      } else if(selectedLabel.includes('USDC')) {
        alertStore.liquidationsAtRisk = 89999;
      } else {
        alertStore.liquidationsAtRisk = 20050;
      }
    }

    return (
      <div className="tabnav">
      <select onChange={onPoolSelect}>
        {loading ? <span>loading...</span> : poolsData.map((pool, i) => {
            const symbol = tokenData.find(t => t.address === pool.underlying)?.symbol;
            return <option key={i} value={pool.address} /*select={i === 0}*/>{symbol + ' pool'}</option>
        })
      }
      </select>
      </div>
    )
  }
}

export default observer(Tabnav)