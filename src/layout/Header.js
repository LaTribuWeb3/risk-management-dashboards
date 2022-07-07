import React, { Component } from "react";
import {observer} from "mobx-react"
import mainStore from "../stores/main.store"

class Header extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const color = mainStore.blackMode ? 'white' : 'black';
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <img style={{ width: '90%'}} src={`/images/${color}-wordmark.png`}/>
      </div>
    )
  }
}

export default observer(Header)