import React, { Component } from "react";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

// const Tabnav = (props) => {
class Tabnav extends Component {
  render() {
    const loading =
      poolsStore["data/tokens?fakeMainnet=0_loading"] ||
      poolsStore["pools_loading"] ||
      poolsStore["data/creditAccounts?fakeMainnet=0_loading"];
    const poolsData = Object.assign([], poolsStore["pools_data"] || []);
    const tokenData = Object.assign(
      [],
      poolsStore["data/tokens?fakeMainnet=0_data"] || []
    );

    function setActiveTab(tab) {
      poolsStore.setActiveTab(tab);
    }

    return (
      <div className="navwrapper">
        <span>Select Pool:</span>
        <div className="tabnav">
          {loading ? (
            <span>loading...</span>
          ) : (
            poolsData.map((pool, i) => {
              const symbol = tokenData.find(
                (t) => t.address === pool.underlying
              )?.symbol;
              return (
                <button
                  onClick={() => setActiveTab(pool.address)}
                  className={
                    "button " +
                    (poolsStore["tab"] == pool.address ? "active" : "")
                  }
                  key={i}
                  value={pool.address}
                  id={symbol}
                >
                  {symbol}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }
}

export default observer(Tabnav);
