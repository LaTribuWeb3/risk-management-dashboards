import React, { Component } from "react";

import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

// const Tabnav = (props) => {
class Tabnav extends Component {
  render() {
    const loading =
      poolsStore["tokens_loading"] ||
      poolsStore["pools_loading"] ||
      poolsStore["creditAccounts_loading"] ||
      poolsStore["liquidations_loading"] ||
      poolsStore["liquidity_loading"];

    const poolsData = Object.assign([], poolsStore["pools_data"] || []);
    const tokenData = Object.assign([], poolsStore["tokens_data"] || []);

    function setActiveTab(tab, symbol) {
      poolsStore.setActiveTab(tab, symbol);
    }

    return (
      <div className="navwrapper">
        <hgroup>
          <h2>Pool</h2>
          <p className="description">
            Select one of the Gearbox pools to display its related dashboard
          </p>
        </hgroup>
        {/* <div className="tabnav"> */}
        <table className="tabnav">
          <tbody>
            <tr>
              {loading ? (
                <td>loading...</td>
              ) : (
                poolsData.map((pool, i) => {
                  const symbol = tokenData.find(
                    (t) => t.address === pool.underlying
                  )?.symbol;

                  if (i === 0 && poolsStore["tab"] === null) {
                    poolsStore.setActiveTab(pool.address, symbol);
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
          </tbody>
        </table>
      </div>
      // </div>
    );
  }
}

export default observer(Tabnav);
