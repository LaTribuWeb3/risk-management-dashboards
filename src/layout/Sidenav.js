import React from "react"
import {observer} from "mobx-react"
import Footer from './Footer'
import Header from './Header'

const pages = [
  'overview',
  'accounts',
  'oracles',
  'liquidity',
  'backstop',
  'assumptions',
  'qualitative-anlysis',
  'risk-parameters',
  'simulation'
]


const Sidenav = (props) => {
  return (
    <div className="side-bar box-space">
      <Header/>
      <aside>
        <nav>
          <ul>
            {pages.map(page=> <li key={page}>
              <a
                href={'#'+page}
                data-to-scrollspy-id={page}
                className='nav-link'
              >
                {page}
              </a>
            </li>)}
          </ul>
        </nav>
      </aside>
    </div>
  )
}

export default observer(Sidenav)