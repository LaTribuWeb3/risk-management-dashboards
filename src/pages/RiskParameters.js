import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import {removeTokenPrefix} from '../utils'
import CapInput from '../components/CapInput'
import riskStore from '../stores/risk.store'

const NumConfig = observer(({row, field}) => {
  return <div>
    <input className="lean-input" onChange={(event)=>riskStore.changeData(row, field, event)} type="number" value={row[field]} id="tentacles" name="tentacles"min="0" max="100"/>
  </div>
})

const columns = [
  {
      name: '',
      selector: row => row.asset,
      format: row => removeTokenPrefix(row.asset),
  },
  {
      name: 'Mint Cap',
      selector: row => row.mint_cap,
      format: row => <CapInput row={row} field={'mint_cap'}/>,
  },  
  {
      name: 'Borrow Cap',
      selector: row => row.borrow_cap,
      format: row => <CapInput row={row} field={'borrow_cap'}/>,
  },   
  {
      name: 'Collateral Factor',
      selector: row => row.collateral_factor.toFixed(2),
  },  
];


class RiskParameters extends Component {
  render (){
    return (
      <div>
        <Box>
          <DataTable
              columns={columns}
              data={riskStore.data}
          />
        </Box>
      </div>
    )
  }
}

export default observer(RiskParameters)