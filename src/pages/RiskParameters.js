import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import {removeTokenPrefix} from '../utils'
import CapInput from '../components/CapInput'
import Recomendation from '../components/Recomendation'
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
      selector: row => row.collateral_factor,
      format: row => <Recomendation row={row}/>,
  },  
];


class RiskParameters extends Component {
  render (){
    const loading = mainStore['risk_params_loading']
    return (
      <div>
        <Box loading={loading}>
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