import React, { useState, useEffect } from "react"
import {observer} from "mobx-react"
import Footer from './Footer'
import Header from './Header'

const activeStyle = {
  transition: 'all 0.3s ease-in-out',
}

const pages = [
  'overview',
  'accounts',
  'oracles',
  'liquidity',
  'backstop',
  'assumptions',
  'qualitative-anlysis'
]


const Sidenav = (props) => {
  const [hash, setHash] = useState(null);
  const urlHash = (window.location.hash || "").replace('#', '')

  // happens only once
  useEffect(() => {
    // window.addEventListener('load', ()=> {
    //   if(!hash && urlHash.length){
    //     setHash(urlHash)
    //     setTimeout(()=> {
    //       document.querySelector('#' + urlHash).scrollIntoView({
    //         behavior: 'auto'
    //       });
    //     }, 100)
    //   }
    // }, {once: true});// fires only once
  }, [])

  return (
    <div className="side-bar box-space">
      <Header/>
      <aside>
        <nav>
          <ul>
            {pages.map(page=> <li key={page}>
              <a
                href={'#'+page}
                style={activeStyle}
                className={hash === page ? 'primary' : 'secondary'}
                onClick={()=> setHash(page)}
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