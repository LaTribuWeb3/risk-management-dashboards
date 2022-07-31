import { makeAutoObservable, runInAction } from "mobx"
import mainStore from "./main.store"
import riskStore from "./risk.store"
import { removeTokenPrefix } from "../utils"
import { whaleFriendlyFormater } from '../components/WhaleFriendly'

const priceOracleDiffThreshold = 5

const percentFromDiff = (base, num) => {
  const diff = ((num / base) * 100) - 100
  return Math.abs(diff)
}

class AlertStore {
  alerts = []
  loading = true
  constructor() {
    makeAutoObservable(this)
    this.init()
  }
  
  init = async () => {
    const alerts = await Promise.all([
      this.getOracleAlert(),
      this.getWhaleAlert(),
      this.getUtilizationAlert(),
      this.getCollateralFactor(),
      this.getOpenLiquidations(),
      this.getLiquidationsRisk(),
      this.getValueRisk(),
    ])
    runInAction(() => {
      this.alerts = alerts
      this.loading = false
    })
  }

  getValueRisk = async () => {
    const alerts = []
    const data = mainStore.clean( await mainStore['current_simulation_risk_request'])
    let valueAtRisk = 0
    Object.values(data).forEach(o=> {
      
      Object.entries(o).forEach(([k, v])=> {
        if (k === 'summary'){
          return
        }
        valueAtRisk += Number(v.pnl)
      })
    })
    debugger
    return {
      title: 'value at risk',
      data: alerts,
      singleMetric: whaleFriendlyFormater(valueAtRisk),
      negative: valueAtRisk > 0
    }
  }

  getLiquidationsRisk = async () => {
    const alerts = []
    const data = mainStore.clean( await mainStore['current_simulation_risk_request'])
    let liquidationsAtRisk = 0
    Object.values(data).forEach(o=> {
      Object.entries(o).forEach(([k, v])=> {
        if (k === 'summary'){
          return
        }
        liquidationsAtRisk += Number(v.total_liquidation)
      })
    })
    return {
      title: 'liquidations at risk',
      data: alerts,
      singleMetric: whaleFriendlyFormater(liquidationsAtRisk),
      negative: liquidationsAtRisk > 0
    }
  }

  getOpenLiquidations = async () => {
    const alerts = []
    const { data: openLiquidations} = mainStore.clean( await mainStore['open_liquidations_request'])
    openLiquidations.forEach(ol=> {
      alerts.push(`account ${ol.account} is being liquidated`)
    })
    return {
      title: 'open liquidations alert',
      data: alerts
    }
  }

  getOracleAlert = async () => {
    const oracles = mainStore.clean(await mainStore['oracles_request'])
    const alerts = Object.entries(oracles)
      .map(([key, row]) => {
        const diff = Math.max(percentFromDiff(row.oracle, row.cex_price), percentFromDiff(row.oracle, row.dex_price))
        if(diff >= priceOracleDiffThreshold){
          return `${removeTokenPrefix(key)} price oracle has a ${diff.toFixed(0)}% diffrence from exchange price`
        }
      })
      .filter(r => !!r)

      return {
          title: 'oracle alert',
          data: alerts, 
      }
  }

  getWhaleAlert = async () => {
    const whales = mainStore.clean(await mainStore['risky_accounts_request'])
    const alerts = []
    Object.entries(whales)
      .map(([key, row]) => {
        row.big_collateral.forEach(({id: account, size})=> {
          alerts.push(`account ${account} has $${whaleFriendlyFormater(size)} of ${removeTokenPrefix(key)} as collateral`)
        })        
        row.big_debt.forEach(({id: account, size})=> {
          alerts.push(`account ${account} has $${whaleFriendlyFormater(size)} of ${removeTokenPrefix(key)} in debt`)
        })
      })
    return {
      title: 'whale alert',
      data: alerts
    }
  }

  getUtilizationAlert = async () => {
    const markets = {}
    const alerts = []
    const currentUsage = mainStore.clean(await mainStore['accounts_request'])
    
    Object.entries(currentUsage).forEach(([k, v]) => {
      markets[k] = markets[k] || { market: k }
      markets[k].mint_usage = Number(v.total_collateral)
      markets[k].borrow_usage = Number(v.total_debt)
    })
    const currentCaps = mainStore.clean(await mainStore['lending_platform_current_request'])
    Object.entries(currentCaps).forEach(([k, v]) => {
      if(k === 'borrow_caps'){
        Object.entries(v).forEach(([asset, cap]) => {
          if(cap === '0'){
            cap = Infinity
          }
          else if(cap === '1'){
            cap = 0
          }
          else {
            cap = Number(cap)
          }
          markets[asset].borrow_cap = cap
        })
      }
      if(k === 'collateral_caps'){
        Object.entries(v).forEach(([asset, cap]) => {
          if(cap === '0'){
            cap = Infinity
          }
          else if(cap === '1'){
            cap = 0
          }
          else {
            cap = Number(cap)
          }
          markets[asset].mint_cap = cap
        })
      }
    })
    
    Object.values(markets)
      .forEach(market => {
        const mintUtilization = (market.mint_usage / market.mint_cap) * 100
        if(mintUtilization > 70){
          alerts.push(`${market.market} mint utilization is ${mintUtilization}% of mint cap`)
        }
        const borrowUtilization = (market.borrow_usage / market.borrow_cap) * 100
        if(borrowUtilization > 70){
          alerts.push(`${market.market} borrow utilization is ${borrowUtilization}% of borrow cap`)
        }
      })
    return {
      title: 'utilization alert',
      data: alerts
    }
  }

  getCollateralFactor = async () => {
    const alerts = []
    const [currentUtilization, currentCap, simulation] = await riskStore.getRecommendations()
    //getCurrentCollateralFactor
    currentUtilization.forEach(row => {
      const currentCF = Number(riskStore.getCurrentCollateralFactor(row.asset))
      const recommendedCF = row.collateral_factor
      if(currentCF > recommendedCF){
        alerts.push(`${removeTokenPrefix(row.asset)} current collateral factor (${currentCF}) is higher than recommended (${recommendedCF.toFixed(2)}) based on actual usage `)
      }
    })
    currentCap.forEach(row => {
      const currentCF = Number(riskStore.getCurrentCollateralFactor(row.asset))
      const recommendedCF = row.collateral_factor
      if(currentCF > recommendedCF){
        alerts.push(`${removeTokenPrefix(row.asset)} current collateral factor (${currentCF}) is higher than recommended (${recommendedCF.toFixed(2)}) based on current borrow & mint caps`)
      }
    })
    simulation.forEach(row => {
      const currentCF = Number(riskStore.getCurrentCollateralFactor(row.asset))
      const recommendedCF = Number(row.max_collateral)
      if(currentCF > recommendedCF){
        alerts.push(`${removeTokenPrefix(row.asset)} current collateral factor (${currentCF}) is higher than recommended (${recommendedCF.toFixed(2)}) based on our simulation`)
      }
    })
    return {
      title: 'collateral factor alert',
      data: alerts, 
    }
  }
}

export default new AlertStore()