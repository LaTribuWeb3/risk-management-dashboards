import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import web3Utils from "web3-utils"

const {fromWei, toBN} = web3Utils
const platformId = 0
const apiEndpoints = ['overview', 'accounts', 'dex_liquidity', 'oracles', 'usd_volume_for_slippage', 'current_simulation_risk',
                      'risk_params']

class MainStore {

  apiUrl = 'https://analytics.riskdao.org'
  blackMode =  null
  loading = {}
  apiData = {}

  constructor () {
    this.init()
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
      this.blackMode = true
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.blackMode = !!e.matches
    });
    makeAutoObservable(this)
  }

  setBlackMode = (mode) => {
    this.blackMode = mode
  }

  init = () => {
    apiEndpoints.forEach(this.fetchData)
  }

  fetchData = (endpoint) => {
    this[endpoint + '_loading'] = true
    this[endpoint + '_data'] = null
    axios.get(`${this.apiUrl}/${endpoint}/${platformId}`)
    .then(({data})=> {
      this[endpoint + '_loading'] = false
      this[endpoint + '_data'] = data
    })
    .catch(console.error)
  }
}

export default new MainStore()
