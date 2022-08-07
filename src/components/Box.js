import React from 'react'
import {observer} from 'mobx-react'
import LastUpdate from './LastUpdate'

const Box = props => {
  const box = {
    width: '100%',
    minHeight: '200px',
    marginTop: 0,
    padding: '40px',
    marginBottom: 'var(--spacing)',
    height: props.height
  }
  return (
    <article style={box} aria-busy={props.loading}>
      {props.children}
      {props.time && <LastUpdate time={props.time}/>}
    </article>
  )
}

export default observer(Box)