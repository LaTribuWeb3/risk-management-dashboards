import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import LiquidationsGraph from '../components/LiquidationsGraph'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import { makeAutoObservable, runInAction } from "mobx"
import Token from "../components/Token"
import {TopTenAccounts, usersMinWidth} from "../components/TopAccounts"


class LocalStore {
  looping = true

  constructor (){
    if(window.APP_CONFIG.feature_flags.loopingToggle  === false){
      this.looping = false
    }
    makeAutoObservable(this)
  }

  toggleLooping = () => {
    this.looping = !this.looping
  }

  get loopingPrefix(){
    return !this.looping ? '' : 'nl_'
  }

  prefixLooping = str => {
     return this.loopingPrefix + str
  }
}

const localStore = new LocalStore()

const rowPreExpanded = row => row.defaultExpanded
  
class Accounts extends Component {
  render (){
    const {prefixLooping} = localStore

    const onRowExpandToggled = (expanded, row) => {
      if(expanded === false){
        row.top10Coll = false
        row.top10Debt = false
      }
      row.expanded = expanded
    }

    const toggleTopTen = (row, name) => {
      row[name] = !row[name]
    }
    const columns = [
      {
          name: 'Asset',
          selector: row => row.key,
          format: row => <Token value={row.key}/>,
          sortable: true,
          minWidth: '110px'
      },  
      {
          name: 'Total Collateral',
          selector: row =>  Number(row[prefixLooping('total_collateral')]),
          format: row => whaleFriendlyFormater(row[prefixLooping('total_collateral')]),
          sortable: true,
          minWidth: '140px'
      },
      {
          name: 'Median Collateral',
          selector: row =>  Number(row[prefixLooping('median_collateral')]),
          format: row => whaleFriendlyFormater(row[prefixLooping('median_collateral')]),
          sortable: true,
          minWidth: '140px'
      },  
      {
          name: 'Top 10 Accounts Collateral',
          selector: row =>  Number(row[prefixLooping('top_10_collateral')]),
          format: row => < TopTenAccounts row={row} name={"top10Coll"} toggleTopTen={toggleTopTen} accounts={row.whales.big_collateral} value={whaleFriendlyFormater(row[prefixLooping('top_10_collateral')])}/>,
          sortable: true,
          minWidth: usersMinWidth
      },
      {
          name: 'Top 1 Account Collateral',
          selector: row =>  Number(row['top_1_collateral']),
          format: row => whaleFriendlyFormater(row['top_1_collateral']),
          sortable: true,
          minWidth: '140px'
      },
    ]

    const loading = mainStore['accounts_loading'] || mainStore['whale_accounts_loading']
    const rawData = Object.assign({}, mainStore['accounts_data'] || {})
    const whaleData = mainStore['whale_accounts_data'] || {}
    console.log('whale data', whaleData)
    
    const {json_time} = rawData
    if(json_time){
      delete rawData.json_time
    }
    const data = !loading ? Object.entries(rawData)
    .filter(([k, v])=> k !== window.APP_CONFIG.STABLE || "")
    .map(([k, v])=> {
      v.key = k
      v.whales = whaleData[k]
      return v
    })
    : []

    if(data.length){
      data[0].defaultExpanded = true  
    }
    

    const text = "* Big account included in the list"
    console.log('datatable data', Object.entries(data))
    return (
      <div>
        <Box loading={loading} time={json_time} text={text}>
        {window.APP_CONFIG.feature_flags.loopingToggle && <fieldset>
          <label htmlFor="switch">
            <input onChange={localStore.toggleLooping} defaultChecked={localStore.looping} type="checkbox" id="switch" name="switch" role="switch"/>
            <span>Ignore correlated debt and collateral, and assets not in market</span>
          </label>
        </fieldset>}
          {!loading && <DataTable
              expandableRows
              columns={columns}
              defaultSortFieldId={2}
              defaultSortAsc={true}
              data={data}
              // expandableRowsComponent={LiquidationsGraph}
              expandableRowExpanded={rowPreExpanded}
              onRowExpandToggled={onRowExpandToggled}
          />}
        </Box>
      </div>
    )
  }
}

export default observer(Accounts)
