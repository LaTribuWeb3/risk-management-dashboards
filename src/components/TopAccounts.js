import React from 'react'
import {observer} from 'mobx-react'
import {whaleFriendlyFormater} from '../components/WhaleFriendly'
import {precentFormatter} from '../utils'
import BlockExplorerLink from '../components/BlockExplorerLink'

export const usersMinWidth = '180px'

export const TopTenAccounts = props => {
  const {accounts, value} = props
  let hasWhales = false
  for (const account of accounts) {
    if(!!account.whale_flag){
      hasWhales = true
      break
    }
  }
  return (
    <div style={{display: 'flex', width: '100%'}}>
      <details style={{padding: '0', border: 'none', marginBottom: '0', width: usersMinWidth}}>
        <summary>{value} {hasWhales &&<span>*</span>}</summary>
        <div style={{display: 'flex', flexDirection: 'column', width: usersMinWidth, }}>
          {accounts.map(account=> {
            return <div key={account.id} style={{display: 'flex', maxWidth: '100%'}}>
              <div style={{maxWidth: '40%'}}>
                <BlockExplorerLink  address={account.id}/>
              </div>
              <div>{whaleFriendlyFormater(account.size)} </div>
            </div>
          })}
        </div>
      </details>
    </div>
  )
}

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