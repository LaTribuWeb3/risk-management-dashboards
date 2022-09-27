import { makeAutoObservable } from "mobx"
import axios from "axios"

const apiEndpoints = ['data/tokens?fakeMainnet=0', 'pools', 'data/creditAccounts?fakeMainnet=0']
class PoolsStore {
  constructor () {
    this.init()
    makeAutoObservable(this)
  }

  apiUrl = process.env.REACT_APP_API_URL || 'http://dev-0.la-tribu.xyz:8081'
  loading = {}
  apiData = {}

  init = () => {
    this['tab'] = null;
    apiEndpoints.forEach(this.fetchData);
  }

  setActiveTab(tab){
    this.tab = tab;
  }

  fetchData = (endpoint) => {
    this[endpoint + '_loading'] = true
    this[endpoint + '_data'] = null
    this[endpoint + '_request'] = axios.get(`${this.apiUrl}/${endpoint}/`)
    .then(({data})=> {
      this[endpoint + '_loading'] = false
      this[endpoint + '_data'] = data
      if(endpoint == 'pools'){
        this['tab'] = data[0].address;
      }
      return data
    })
    .catch(console.error)
  }
}
export default new PoolsStore()
