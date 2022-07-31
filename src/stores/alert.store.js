import { makeAutoObservable, runInAction } from "mobx"
import mainStore from "./main.store"
import riskStore from "./risk.store"
import { removeTokenPrefix } from "../utils"
import { whaleFriendlyFormater } from '../components/WhaleFriendly'
import BlockExplorerLink from "../components/BlockExplorerLink"
import Ramzor from "../components/Ramzor"

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
      this.getCollateralFactor(),
      this.getOpenLiquidations(),
      this.getOracleAlert(),
      this.getWhaleAlert(),
      this.getUtilizationAlert(),
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
    const columns = [
      {
        name: 'User',
        selector: row => row.user,
        format: row => <BlockExplorerLink address={row.user}/>,
        sortable: true,
      },
      {
        name: 'Debt Size',
        selector: row => row.debt,
        sortable: true,
      },
    ]
    const { data: openLiquidations } = mainStore.clean( await mainStore['open_liquidations_request'])
    openLiquidations.forEach(ol=> {
      alerts.push({
        user: ol.account,
        debt: ol.user_debt_wo_looping
      })
    })
    return {
      title: 'open liquidations',
      data: alerts,
      columns
    }
  }

  getOracleAlert = async () => {
    const oracles = mainStore.clean(await mainStore['oracles_request'])
    const columns = [
      {
        name: 'Asset',
        selector: row => row.asset,
        format: row => <b>{removeTokenPrefix(row.asset)}</b>,
        sortable: true,
      },
      {
        name: 'Deviation',
        selector: row => row.diff,
        format: row => <Ramzor 
        red={row.diff >5 || row.diff < -5}> {row.diff.toFixed(2)}%</Ramzor>,
        sortable: true,
      }
    ]
    const alerts = Object.entries(oracles)
      .map(([key, row]) => {
        const diff = Math.max(percentFromDiff(row.oracle, row.cex_price), percentFromDiff(row.oracle, row.dex_price))
        if(diff >= priceOracleDiffThreshold){

          return {
            asset: removeTokenPrefix(key),
            diff,
          }
        }
      })
      .filter(r => !!r)

      return {
          title: 'oracles',
          data: alerts,
          columns
      }
  }

  getWhaleAlert = async () => {
    const whales = mainStore.clean(await mainStore['whale_accounts_request'])
    const alerts = []
    const columns = [
      {
        name: 'Asset',
        selector: row => removeTokenPrefix(row.asset),
        format: row => <b>{removeTokenPrefix(row.asset)}</b>,
        sortable: true,
      },
      {
        name: 'Collateral / Debt',
        selector: row => row.type,
        sortable: true,
      },
      {
        name: 'Size',
        selector: row => row.size,
        format: row => whaleFriendlyFormater(row.size),
        sortable: true,
      },
      {
        name: 'Address',
        selector: row => row.account,
        format: row => <BlockExplorerLink address={row.account}/>,
        sortable: true,
      }

    ]
    Object.entries(whales)
      .map(([key, row]) => {
        row.big_collateral.forEach(({id: account, size})=> {
          alerts.push({
            asset: key,
            type: 'Collateral',
            size,
            account,
          })
        })        
        row.big_debt.forEach(({id: account, size})=> {
          alerts.push({
            asset: key,
            type: 'Debt',
            size,
            account,
          })        
        })
      })
    return {
      title: 'whales',
      data: alerts,
      columns
    }
  }

  getUtilizationAlert = async () => {
    const markets = {}
    const alerts = []
    const columns = [
      {
        name: 'Asset',
        format: row => <b>{removeTokenPrefix(row.asset)}</b>,
        selector: row => row.asset
      },
      {
        name: 'Supply/ Borrow',
        selector: row => row.type
      },
      {
        name: 'Cap',
        selector: row => row.cap
      }
    ]
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
          alerts.push({
            asset: market.market,
            type: 'Supply',
            cap: mintUtilization
          })
        }
        const borrowUtilization = (market.borrow_usage / market.borrow_cap) * 100
        if(borrowUtilization > 70){
          alerts.push({
            asset: market.market,
            type: 'borrow',
            cap: borrowUtilization
          })
        }
      })
    return {
      title: 'utilization',
      data: alerts,
      columns
    }
  }

  getCollateralFactor = async () => {
    const alerts = []
    const columns = [
      {
        name: 'Asset',
        selector: row => removeTokenPrefix(row.asset),
        format: row => <b>{removeTokenPrefix(row.asset)}</b>,
        sortable: true,
      },
      {
        name: 'Current CF',
        selector: row => row.currentCF,
        sortable: true,
      },
      {
        name: 'Recommended CF',
        selector: row => row.recommendedCF,
        sortable: true,
      },
      {
        name: 'Based On',
        selector: row => row.basedOn,
        sortable: true,
      }
    ]
    const [currentUtilization, currentCap, simulation] = await riskStore.getRecommendations()
    //getCurrentCollateralFactor
    currentUtilization.forEach(row => {
      const currentCF = Number(riskStore.getCurrentCollateralFactor(row.asset))
      const recommendedCF = row.collateral_factor
      if(currentCF > recommendedCF){
        alerts.push({
          asset: row.asset,
          currentCF,
          recommendedCF: recommendedCF.toFixed(2),
          "basedOn": "usage"
        })
      }
    })
    currentCap.forEach(row => {
      const currentCF = Number(riskStore.getCurrentCollateralFactor(row.asset))
      const recommendedCF = row.collateral_factor
      if(currentCF > recommendedCF){
        alerts.push({
          asset: row.asset,
          currentCF,
          recommendedCF: recommendedCF.toFixed(2),
          "basedOn": "caps"
        })
      }
    })
    simulation.forEach(row => {
      const currentCF = Number(riskStore.getCurrentCollateralFactor(row.asset))
      const recommendedCF = Number(row.max_collateral)
      if(currentCF > recommendedCF){
        alerts.push({
          asset: row.asset,
          currentCF,
          recommendedCF: recommendedCF.toFixed(2),
          "basedOn": "Worst Day Scenario"
        })
      }
    })
    return {
      title: 'collateral factors',
      data: alerts,
      columns: columns
    }
  }
}

export default new AlertStore()