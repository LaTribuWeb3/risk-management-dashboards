import React, { Component } from "react";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

// const Tabnav = (props) => {
class Tabnav extends Component {
  render() {
    const loading =
      poolsStore["data/tokens?fakeMainnet=0_loading"] ||
      poolsStore["pools_loading"] ||
      poolsStore["data/creditAccounts?fakeMainnet=0_loading"] ||
      poolsStore["data/liquidations_loading"] ||
      poolsStore["data/liquidity_loading"] ;

    const poolsData = Object.assign([], poolsStore["pools_data"] || []);
    const tokenData = Object.assign(
      [],
      poolsStore["data/tokens?fakeMainnet=0_data"] || []
    );

    const allCreditAccounts = Object.assign(
      [],
      poolsStore["data/creditAccounts?fakeMainnet=0_data"] || []);

    function setActiveTab(tab, symbol) {
        console.log('allCreditAccounts', allCreditAccounts);
        poolsStore.setActiveTab(tab, symbol, allCreditAccounts);
      
    }

    return (
      <div className="navwrapper">
        <hgroup>
          <h2>Pool</h2>
          <p className="description">Select one of the Gearbox pools to display its related dashboard</p>
        </hgroup>
        {/* <div className="tabnav"> */}
        <table className="tabnav">
          <tr>
            {loading ? (
                    <span>loading...</span>
                  ) : (
                    poolsData.map((pool, i) => {
                      const symbol = tokenData.find(
                        (t) => t.address === pool.underlying
                      )?.symbol;

                      if(i === 0 && poolsStore["tab"] === null) {
                        console.log('i ==', 0);
                        poolsStore.setActiveTab(pool.address, symbol, allCreditAccounts);
                      }
                      return (
                        
                      <td key={i} className="tabnav-td">
                        <button
                          onClick={() => setActiveTab(pool.address, symbol)}
                          className={
                            "tnbtn " +
                            (poolsStore["tab"] === pool.address ? "active" : "")
                          }
                          key={i}
                          value={pool.address}
                          id={symbol}
                        >
                          {symbol}
                        </button>
                    </td>
                      );
                    })
                  )}
          </tr>
</table>
          
        </div>
      // </div>
    );
  }
}

export default observer(Tabnav);
