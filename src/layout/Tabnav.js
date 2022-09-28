import React, { Component } from "react"
import { observer } from "mobx-react"
import poolsStore from "../stores/pools.store"
import alertStore from '../stores/alert.store'
import mainStore from "../stores/main.store"
import BigNumber from "bignumber.js";

// const Tabnav = (props) => {
class Tabnav extends Component {



  render() {
    const loading = poolsStore['data/tokens?fakeMainnet=0_loading']
      || poolsStore['pools_loading']
      || poolsStore['data/creditAccounts?fakeMainnet=0_loading'];
    const poolsData = Object.assign([], poolsStore['pools_data'] || []);
    const tokenData = Object.assign([], poolsStore['data/tokens?fakeMainnet=0_data'] || []);
    const creditAccountData = Object.assign([], poolsStore['data/creditAccounts?fakeMainnet=0_data'] || []);



    function setActiveTab(tab) {
      poolsStore.setActiveTab(tab);
      selectedPoolData(tab);
    }

    function selectedPoolData(tab) {
      mainStore['overview_loading'] = true;
      const selectedPoolAddress = tab;
      alertStore.valueAtRisk = selectedPoolAddress;

      const selectedPool = poolsData.find(p => p.address === selectedPoolAddress);
      const creditAccountsForPool = creditAccountData.filter(ca => ca.poolAddress === selectedPoolAddress);

      // compute value in $ for each credit account
      for (let i = 0; i < creditAccountsForPool.length; i++) {
        let collateralValue = 0;
        for (let j = 0; j < creditAccountsForPool[i].tokenBalances.length; j++) {
          const tokenAddress = creditAccountsForPool[i].tokenBalances[j].address;
          const amountWDecimals = creditAccountsForPool[i].tokenBalances[j].amount;
          const token = tokenData.filter(tk => tk.address == tokenAddress);
          const tokenDecimals = token[0]['decimals'];
          const tokenPrice = ((BigNumber(token[0]['priceUSD18Decimals']).div(1e18))).toString();
          const amount = (BigNumber(amountWDecimals).div(BigNumber(10).pow(tokenDecimals))).toString();
          if (amountWDecimals !== '0') {
            collateralValue = BigNumber(collateralValue).plus(BigNumber(amount).multipliedBy(BigNumber(tokenPrice)));
          }
        }
        creditAccountsForPool[i]['collateralValue'] = collateralValue.toString();
      }

      // compute total collateral value for pool
      let totalCollateral = 0
      for (let i = 0; i < creditAccountsForPool.length; i++) {
        totalCollateral = BigNumber(totalCollateral).plus(BigNumber(creditAccountsForPool[i]['collateralValue']));
      }
      const calculatedTotalCollateral = totalCollateral;
      //////END

      // compute top 1 collateral
      let currentTopOneCollateral = 0;
      for (let i = 0; i < creditAccountsForPool.length; i++) {
        if(BigNumber(currentTopOneCollateral).isLessThan(BigNumber(creditAccountsForPool[i]['collateralValue']))){
          currentTopOneCollateral = creditAccountsForPool[i]['collateralValue']
        }
      }

      const calculatedTop1Collateral = currentTopOneCollateral; 
      //////END

      // compute top 10 collateral
      let collateralArray = [];
      for (let i = 0; i < creditAccountsForPool.length; i++) {
        collateralArray.push(creditAccountsForPool[i]['collateralValue'])
        }
        console.log('collateralArray is', collateralArray);
        collateralArray.sort((a, b) => a - b);
        console.log('sorted',collateralArray);
        const calculatedTop10Collateral = 0; // TODO


      // compute total debt
      let totalDebt = 0;
      const poolUnderlying = tokenData.filter(tk => tk.address == selectedPool['underlying']);
      const underlyingPrice = BigNumber(poolUnderlying[0]['priceUSD18Decimals']).div(BigNumber(10).pow(18));
      totalDebt = BigNumber(selectedPool.totalBorrowed).div(BigNumber(10).pow(poolUnderlying[0]['decimals']));
      totalDebt = BigNumber (totalDebt).multipliedBy(BigNumber(underlyingPrice));
      const calculatedTotalDebt = totalDebt.toString();

      // compute top 1 debt
      let currentTopOneDebt = 0;
      for (let i = 0; i < creditAccountsForPool.length; i++) {
        if(BigNumber(currentTopOneDebt).isLessThan(BigNumber(creditAccountsForPool[i]['borrowedAmountPlusInterestAndFees']))){
          currentTopOneDebt = creditAccountsForPool[i]['borrowedAmountPlusInterestAndFees']
        }
      }
      currentTopOneDebt = BigNumber(currentTopOneDebt).div(BigNumber(10).pow(poolUnderlying[0]['decimals']));
      currentTopOneDebt = BigNumber(currentTopOneDebt).multipliedBy(BigNumber(underlyingPrice));
      const calculatedTop1Debt = currentTopOneDebt.toString(); 
      //////END

        const calculatedTop10Debt = 0; // TODO



      const indexedTokenSum = {};
      for (let i = 0; i < creditAccountsForPool.length; i++) {
        for (let j = 0; j < creditAccountsForPool[i].tokenBalances.length; j++) {
          const tokenAddress = creditAccountsForPool[i].tokenBalances[j].address;
          const amount = creditAccountsForPool[i].tokenBalances[j].amount;
          const valToAddBN = BigNumber(amount);
          if (valToAddBN.gt(0)) {
            const symbol = tokenAddress;// find token symbol from token address
            let lastValue = indexedTokenSum[symbol];
            if (lastValue === undefined) {
              lastValue = 0;
            }
            const lastValBN = BigNumber(lastValue);

            const tokenDecimals = 6 // todo replace by good value
            let newTokenAmount = lastValBN.plus(valToAddBN);
            // console.log(newTokenAmount.toString());
            newTokenAmount = newTokenAmount.div(BigNumber(10).pow(tokenDecimals));
            // console.log(newTokenAmount.toString());
            newTokenAmount = newTokenAmount.toNumber();
            // console.log(newTokenAmount.toString());
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
      <div className="navwrapper">
        <span>Select Pool</span>
        <div className="tabnav">
          {loading ? <span>loading...</span> : poolsData.map((pool, i) => {
            const symbol = tokenData.find(t => t.address === pool.underlying)?.symbol;
            return <button onClick={() => setActiveTab(pool.address)} className={'button ' + (poolsStore['tab'] == pool.address ? 'active' : '')} key={i} value={pool.address} id={symbol} >{symbol}</button>
          })
          }
        </div>
      </div>
    )
  }
}

export default observer(Tabnav)