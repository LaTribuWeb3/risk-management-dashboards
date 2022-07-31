import React from "react"
import {observer} from "mobx-react"
import Footer from './Footer'
import Header from './Header'

const pages = [
  'system-status',
  'overview',
  'asset-distribution',
  'oracle-deviation',
  'liquidity',
  // 'backstop',
  // 'assumptions',
  //'qualitative-anlysis',
  'collateral-factors',
  'simulation'
]

const humanPagesMap = {
  liquidity: "DEX Liquidity"
}


const Sidenav = (props) => {
  return (
    <div className="side-bar box-space">
      {/* <Header/> */}
      <aside>
        <nav>
          <ul>
            {pages.map(page=> <li key={page}>
              <a
                href={'#'+page}
                data-to-scrollspy-id={page}
                className='nav-link'
              >
                {humanPagesMap[page] || page.split('-').join(' ')}
              </a>
            </li>)}
          </ul>
        </nav>
      </aside>
    </div>
  )
}

export default observer(Sidenav)