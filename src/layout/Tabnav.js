import React, {Component} from "react"
import {observer} from "mobx-react"
import poolsStore from "../stores/pools.store"
import alertStore from '../stores/alert.store'
import mainStore from "../stores/main.store"
import BigNumber from "bignumber.js";

// const Tabnav = (props) => {
class Tabnav extends Component {
  render (){
    const loading = poolsStore['data/tokens?fakeMainnet=0_loading'] 
                    || poolsStore['pools_loading'] 
                    || poolsStore['data/creditAccounts?fakeMainnet=0_loading'];
    const poolsData = Object.assign([], poolsStore['pools_data'] || []);
    const tokenData = Object.assign([], poolsStore['data/tokens?fakeMainnet=0_data'] || []);
    const creditAccountData = Object.assign([], poolsStore['data/creditAccounts?fakeMainnet=0_data'] || []);
    
    function onPoolSelect(event) {
      mainStore['overview_loading'] = true;
      const selectedLabel = event.target.selectedOptions[0].label;
      const selectedPoolAddress = event.target.selectedOptions[0].value;
      alertStore.valueAtRisk = selectedPoolAddress;

      const selectedPool = poolsData.find(p => p.address === selectedPoolAddress);
      const creditAccountsForPool = creditAccountData.filter(ca => ca.poolAddress === selectedPoolAddress);

      console.log(selectedPool);
      console.log(poolsData);
      const calculatedTotalCollateral = 0; // TODO
      const calculatedTop1Collateral = 0; // TODO
      const calculatedTop10Collateral = 0; // TODO
      const calculatedTotalDebt = Number(selectedPool.totalBorrowed); // multiply by price of underlying token
      const calculatedTop1Debt = 0; // TODO
      const calculatedTop10Debt = 0; // TODO

      const indexedTokenSum = {};
      for(let i = 0; i < creditAccountsForPool.length; i++) {
        for(let j = 0; j < creditAccountsForPool[i].tokenBalances.length; j++) {
          const tokenAddress = creditAccountsForPool[i].tokenBalances[j].address;
          const amount = creditAccountsForPool[i].tokenBalances[j].amount;
          const valToAddBN = BigNumber(amount);
          if(valToAddBN.gt(0)) {
            const symbol = tokenAddress;// find token symbol from token address
            let lastValue = indexedTokenSum[symbol];
            if(lastValue === undefined) {
              lastValue = 0;
            }
            const lastValBN = BigNumber(lastValue); 

            const tokenDecimals = 6 // todo replace by good value
            let newTokenAmount = lastValBN.plus(valToAddBN);
            console.log(newTokenAmount.toString());
            newTokenAmount = newTokenAmount.div(BigNumber(10).pow(tokenDecimals));
            console.log(newTokenAmount.toString());
            newTokenAmount = newTokenAmount.toNumber();
            console.log(newTokenAmount.toString());
            indexedTokenSum[symbol] = newTokenAmount;
          }
      }
      
      const dataOverview = {
        collateral: {
          totalCollateral: calculatedTotalCollateral,
          top1Collateral: calculatedTop1Collateral,
          top10Collateral: calculatedTop10Collateral
        },
        debt: {
          totalDebt: calculatedTotalDebt,
          top1Debt: calculatedTop1Debt,
          top10Debt: calculatedTop10Debt
        },
        collateralGraphData: indexedTokenSum
    }

    mainStore['overview_data'] = dataOverview;
    mainStore['overview_loading'] = false;


/*
      if(selectedLabel.includes('DAI')) {
        mainStore['overview_data'] = dummy1Overview;
        alertStore.liquidationsAtRisk = 100;
      } else if(selectedLabel.includes('USDC')) {
        mainStore['overview_data'] = dummy2Overview;
        alertStore.liquidationsAtRisk = 89999;
      } else {
        mainStore['overview_data'] = dummy3Overview;
        alertStore.liquidationsAtRisk = 20050;
      }
      */
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