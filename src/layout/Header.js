import React, { Component, Fragment } from "react";
import {observer} from "mobx-react"
import mainStore from "../stores/main.store"

class Header extends Component {

  constructor(props) {
    super(props);
  }

  render () {
    const color = mainStore.blackMode ? 'white' : 'black';
    return (
      <div className="box-space" style={{position: 'fixed', top: 0, width: '100%', height: '100px', paddingLeft: '30px'}}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%'}}>
          <img style={{ width: '15vw'}} src={`/images/${color}-wordmark.png`}/>
          <img style={{ width: '0.7vw', margin: '0 2vw'}} src={`/logos/${color}-x.svg`}/>
          <img style={{ width: '14vw'}} src={`/logos/aurigami.svg`}/>
        </div>
      </div>
    )
  }
}

export default observer(Header)