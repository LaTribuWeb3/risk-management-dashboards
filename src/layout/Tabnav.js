import React, {Component} from "react"
import {observer} from "mobx-react"
import poolsStore from "../stores/pools.store"
import alertStore from '../stores/alert.store'
import mainStore from "../stores/main.store"
import dummy from './dummy_api.json'
import dummyWhales from './dummy_whales.json'

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

      const dummyForPool = dummy[poolAddress];
      console.log(dummyForPool);
      console.log('aaaaaaaaaaaaa', mainStore['accounts_data']);
      mainStore['accounts_data'] = dummyForPool; // poolsStore['pools_d_data'][poolAddress]
      mainStore['whale_accounts_data'] = dummyWhales[poolAddress]; // poolsStore['pool_whale_data'][poolAddress]
      console.log('bbbbbbbbbbbbbbb', mainStore['accounts_data']);

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