import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import Solver from "../risk/solver"
import mainStore from '../stores/main.store'
import orisApiData from "../risk/risk_params.json"

const riskData = [
  {
    asset: "auUSDC",
    mint_cap: 50.0,
    borrow_cap: 50.0,
    collateral_factor: 0,
  },
  {
    asset: "auUSDT",
    mint_cap: 50.0,
    borrow_cap: 50.0,
    collateral_factor: 0,
  },
  {
    asset: "auWNEAR",
    mint_cap: 50.0,
    borrow_cap: 50.0,
    collateral_factor: 0,
  },
  {
    asset: "auSTNEAR",
    mint_cap: 50.0,
    borrow_cap: 0.0,
    collateral_factor: 0,
  },
  {
    asset: "auWBTC",
    mint_cap: 50.0,
    borrow_cap: 50.0,
    collateral_factor: 0,
  },
  {
    asset: "auETH",
    mint_cap: 50.0,
    borrow_cap: 50.0,
    collateral_factor: 0,
  },
]

class RiskStore {
  data = []
  incrementationOptions = {}
  constructor (){
    this.init()
    makeAutoObservable(this)
  }

  init = ()=> {
    // get API data
    //while( mainStore['risk_params_loading']) { console.log( mainStore['risk_params_loading'])}
    //while(loading)
    //console.log({loading})

    console.log("ori", mainStore['risk_params_loading'])
    if(true) {
      const rawData = Object.assign({}, mainStore['risk_params_data'] || {"xxx" : 4})
      const apiData = orisApiData
      // inctanciate a solver
      this.solver = new Solver(apiData)
      console.log({rawData})
      console.log("caps", this.solver.caps)
      runInAction(()=> {
        this.incrementationOptions = this.solver.caps
        console.log(this.incrementationOptions)
        const sorted = riskData.sort((a,b)=> a.asset.localeCompare(b.asset))
        this.data = sorted
      })
    }
  }

  changeData = (row, field, event) => {
    console.log({row, field, event: event.target.value})
    row[field] = event.target.value
  }

  incrament = (row, field) => {
    // find the options
    const options = this.incrementationOptions[row.asset] || []
    console.log({options})
    // find the index of exisiting value
    const currentIndex = options.indexOf(row[field])
    // validate we can incrament or decrament
    if(currentIndex == -1 ){
      console.log('cant incrament 1')
      return
    }
    if(currentIndex === options.length - 1){
      console.log('cant incrament 2')
      return
    }
    // cahnge the value
    row[field] = options[currentIndex+1]
    // then generate mintCaps, borrowCaps & collateralFactorCaps objects
    const mintCaps = {}
    const borrowCaps = {}
    const collateralFactorCaps = {}
    this.data.forEach(row => {
      mintCaps[row.asset] = row.mint_cap
      borrowCaps[row.asset] = row.borrow_cap
      collateralFactorCaps[row.asset] = 0
    })
    const newRiskParameters = this.solver.optimizeCfg(this.solver.findValidCfg(mintCaps, borrowCaps, collateralFactorCaps))
    // then rebuild data object from new configurations
    const newTableData = {}
    Object.entries(newRiskParameters.mintCaps).forEach(([k, v])=> {
      newTableData[k] = newTableData[k] || {asset: k}
      newTableData[k].mint_cap = v
    })
    Object.entries(newRiskParameters.borrowCaps).forEach(([k, v])=> {
      newTableData[k] = newTableData[k] || {asset: k}
      newTableData[k].borrow_cap = v
    })
    Object.entries(newRiskParameters.cfs).forEach(([k, v])=> {
      newTableData[k] = newTableData[k] || {asset: k}
      newTableData[k].collateral_factor = v
    })
    // then rerender
    runInAction(()=> {
      this.data = Object.values(newTableData).sort((a,b)=> a.asset.localeCompare(b.asset))
    })
    console.log('incrament')
  }

  decrament = (row, field) => {
        // find the options
        const options = this.incrementationOptions[row.asset] || []
        // find the index of exisiting value
        const currentIndex = options.indexOf(row[field])
        // validate we can incrament or decrament
        if(currentIndex == -1 ){
          console.log('cant decrament 1')
          return
        }
        if(currentIndex === 0){
          console.log('cant decrament 2')
          return
        }
        // cahnge the value
        row[field] = options[currentIndex-1]
        // then generate mintCaps, borrowCaps & collateralFactorCaps objects
        const mintCaps = {}
        const borrowCaps = {}
        const collateralFactorCaps = {}
        this.data.forEach(row => {
          mintCaps[row.asset] = row.mint_cap
          borrowCaps[row.asset] = row.borrow_cap
          collateralFactorCaps[row.asset] = 0
        })
        const newRiskParameters = this.solver.optimizeCfg(this.solver.findValidCfg(mintCaps, borrowCaps, collateralFactorCaps))
        // then rebuild data object from new configurations
        const newTableData = {}
        Object.entries(newRiskParameters.mintCaps).forEach(([k, v])=> {
          newTableData[k] = newTableData[k] || {asset: k}
          newTableData[k].mint_cap = v
        })
        Object.entries(newRiskParameters.borrowCaps).forEach(([k, v])=> {
          newTableData[k] = newTableData[k] || {asset: k}
          newTableData[k].borrow_cap = v
        })
        Object.entries(newRiskParameters.cfs).forEach(([k, v])=> {
          newTableData[k] = newTableData[k] || {asset: k}
          newTableData[k].collateral_factor = v
        })
        // then rerender
        runInAction(()=> {
          this.data = (Object.values(newTableData)).sort((a,b)=> a.asset.localeCompare(b.asset))
        })
    console.log('decrament')
  }
}

export default new RiskStore()