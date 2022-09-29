import React, { Component } from "react";
import { observer } from "mobx-react";
import { whaleFriendlyFormater } from "../components/WhaleFriendly";
import { precentFormatter } from "../utils";
import BlockExplorerLink from "../components/BlockExplorerLink";

export const usersMinWidth = "180px";

class Top10Accounts extends Component {
  toggle = (e) => {
    this.props.toggleTopTen(this.props.row, this.props.name);
    e.preventDefault();
  };

  render() {
    const { props } = this;
    const { accounts, value } = props;
    let hasWhales = false;
    for (const account of accounts) {
      if (!!account.whale_flag) {
        hasWhales = true;
        break;
      }
    }
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <details
          onClick={this.toggle}
          open={props.row[props.name]}
          style={{
            padding: "1rem 0",
            border: "none",
            marginBottom: "0",
            width: usersMinWidth,
            overflow: "auto",
            overflowX: "hidden",
          }}
        >
          <summary>
            {value} {hasWhales && <span>*</span>}
          </summary>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              overflow: "none",
            }}
          >
            {accounts.map((account) => {
              return (
                <div
                  key={account.id}
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ maxWidth: "45%" }}>
                    <BlockExplorerLink address={account.id} />
                  </div>
                  <div>{whaleFriendlyFormater(account.size)} </div>
                </div>
              );
            })}
          </div>
        </details>
      </div>
    );
  }
}

export const TopTenAccounts = observer(Top10Accounts);

const TopAccounts = (props) => {
  const { row } = props;
  const users = row.users
    .slice()
    .sort((a, b) => Number(b.size) - Number(a.size));
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <details
        style={{
          padding: "0",
          border: "none",
          marginBottom: "0",
          width: usersMinWidth,
        }}
      >
        <summary>{precentFormatter(row.top_5)}</summary>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: usersMinWidth,
          }}
        >
          {users.map((user) => {
            return (
              <div
                key={user.user}
                style={{ display: "flex", maxWidth: "100%" }}
              >
                <div style={{ maxWidth: "40%" }}>
                  <BlockExplorerLink address={user.user} />
                </div>
                <div>{whaleFriendlyFormater(user.size)}</div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
};

export default observer(TopAccounts);
