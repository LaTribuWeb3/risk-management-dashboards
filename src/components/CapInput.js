import React from "react";
import { observer } from "mobx-react";
import { sandboxSwitch } from "../utils";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  compactDisplay: "short",
});

const buttonsStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "5px 20px",
  borderRadius: "var(--border-radius)",
  boxShadow: "var(--card-box-shadow)",
};

class CapInput extends React.Component {
  render() {
    const { row, field } = this.props;
    const val = formatter.format(row[field]);
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span style={{ minWidth: "50px" }}>{val}M</span>
        <span>
          <div style={buttonsStyle}>
            <div
              onClick={() => sandboxSwitch(row, field, "1")}
              className="plus-minus"
            >
              +
            </div>
            <div
              onClick={() => sandboxSwitch(row, field, "0")}
              className="plus-minus"
            >
              -
            </div>
          </div>
        </span>
      </div>
    );
  }
}

export default observer(CapInput);
