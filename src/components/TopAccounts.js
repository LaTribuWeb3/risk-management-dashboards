import React from 'react'
import {observer} from 'mobx-react'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import {precentFormatter} from '../utils'
import BlockExplorerLink from '../components/BlockExplorerLink'

export const usersMinWidth = '180px'

const TopAccounts = props => {
  const {row} = props
  const users = row.users.slice().sort((a,b)=> Number(b.size) - Number(a.size))
  return <div style={{display: 'flex', width: '100%'}}>
    <details style={{padding: '0', border: 'none', marginBottom: '0', width: usersMinWidth}}>
      <summary>{precentFormatter(row.top_5)}</summary>
      <div style={{display: 'flex', flexDirection: 'column', width: usersMinWidth, }}>
        {users.map(user => {
          return <div key={user.user} style={{display: 'flex', maxWidth: '100%'}}>
              <div style={{maxWidth: '40%'}}>
                <BlockExplorerLink  address={user.user}/>
              </div>
              <div >{whaleFriendlyFormater(user.size)}</div>
            </div>
        })}
      </div>
    </details>
  </div>
}

export default observer(TopAccounts)