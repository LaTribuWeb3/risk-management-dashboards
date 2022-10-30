import { Component } from "react";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

class Header extends Component {

  render() {
    const color = mainStore.blackMode ? "white" : "black";
    const logo = mainStore.blackMode
      ? window.APP_CONFIG.WHITE_LOGO
      : window.APP_CONFIG.BLACK_LOGO;
    return (
      <div
        className="box-space"
        style={{
          position: "fixed",
          top: 0,
          width: "var(--sidebar-width)",
          height: "var(--header-height)",
          paddingLeft: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <img
            style={{ height: "calc((var(--header-height) / 2) - 35px)" }}
            src={`/images/${color}-wordmark.png`}
          />
          {/* <img style={{ width: '0.7vw', margin: '0 2vw'}} src={`/logos/${color}-x.svg`}/> */}
          {logo && (
            <img
              style={{ height: "calc((var(--header-height) / 2) - 45px)" }}
              src={`/logos/${logo}`}
            />
          )}
        </div>
      </div>
    );
  }
}

export default observer(Header);
