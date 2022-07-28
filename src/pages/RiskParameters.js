import React, { Component } from "react"
import {observer} from "mobx-react"
import Box from "../components/Box"
import DataTable from 'react-data-table-component'
import mainStore from '../stores/main.store'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import {removeTokenPrefix} from '../utils'
import CapInput from '../components/CapInput'
import CfDiff from '../components/CfDiff'
import riskStore from '../stores/risk.store'
import RiskParametersCurrent from '../components/RiskParametersCurrent'
import RiskParametersUtilization from '../components/RiskParametersUtilization'
import RiskParametersSimulation from '../components/RiskParametersSimulation'

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
      grow: 2
  },
  {
      name: 'Borrow Cap',
      selector: row => row.borrow_cap,
      format: row => <CapInput row={row} field={'borrow_cap'}/>,
      grow: 2
  }, 
  {
      name: 'Collateral Factor (current)',
      selector: row => row.collateral_factor,
      format: row => <CfDiff row={row}/>,
      grow: 2
  }
];

const expendedBoxStyle = {margin: '30px', width: '100%', minHeight: '100px', padding: '30px'}

const Recommendation = (props) => {
  let recommendations = []
  riskStore.recommendations.forEach(r=> {
    if(r.asset === props.data.asset){
      recommendations.push(r.recommendation)
    }
  })
  recommendations = [... new Set(recommendations)]
  return <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
    <article style={expendedBoxStyle}>
      <h6>to improve collateral factor</h6>
      {recommendations.map(r=> <div key={r}>
        <a onClick={()=>riskStore.preformRecommendation(r)}>
          {r}
        </a>
      </div>)}
    </article>
  </div>
}

class RiskParameters extends Component {
  render (){
    const {loading} = riskStore
    const {json_time} = mainStore['risk_params_data'] || {}
    return (
      <div>
        <RiskParametersCurrent/>
        <RiskParametersUtilization/>
        <RiskParametersSimulation />
        {/* <Box loading={loading} time={json_time}>
          <h6>Risk Parameters Recommendations</h6>
          {!loading && <DataTable
              expandableRows
              columns={columns}
              data={riskStore.data}
              expandableRowsComponent={Recommendation}
          />}
        </Box> */}
      </div>
    )
  }
}

export default observer(RiskParameters)