import React from 'react'
import {observer} from 'mobx-react'
import alertStore from '../stores/alert.store'
import Box from "../components/Box"
import BoxRow from "../components/BoxRow"
import BoxGrid from "../components/BoxGrid"

const AtRisk = props => {
  return <BoxGrid>
    <Box>
      <BoxRow>
        <h5 style={{margin: 0}}>Value At Risk</h5>
        <h5 style={{margin: 0}}>{alertStore.valueAtRisk}</h5>
      </BoxRow>
      <hgroup>
        <p>
          Value at Risk reflects bad debt the platform might accrued in a Worst Day simulation.
          Worst Day simulates the current state of the platform during the biggest price drop in ETH history, noramlizing other assets according to their volatility w.r.t ETH.
        </p>
      </hgroup>

    </Box>
    <Box>
      <BoxRow>
        <h5 style={{margin: 0}}>Liquidations At Risk</h5>
        <h5 style={{margin: 0}}>{alertStore.liquidationsAtRisk}</h5>
      </BoxRow>
      <hgroup>
        <p>
          Liquidation at Risk reflects liquidated positions the platform would process in a Worst Day simulation. 
          Worst Day simulates the current state of the platform during the biggest price drop in ETH history, noramlizing other assets according to their volatility w.r.t ETH.
        </p>
      </hgroup>
    </Box>
  </BoxGrid>
}

export default observer(AtRisk)