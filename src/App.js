import "@picocss/pico";
import "./themeSwitcher";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AlertsJson from "./API/AlertsJson";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import React from "react";
import Sidenav from "./layout/Sidenav";
import SinglePage from "./pages/SinglePage";
import mainStore from "./stores/main.store";
import { observer } from "mobx-react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
  }

  render() {
    return (
      <Router>
        <div className="App">
        {mainStore["mobile"] ? '' : <Header />}
          <div ref={this.scrollContainer} className={mainStore["mobile"] ? "main-content-mobile" : "main-content"}>
            {mainStore["mobile"] ? '' : <Sidenav />}
            <h1>Risk Management Dashboard</h1>
            <main>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <SinglePage scrollContainer={this.scrollContainer} />
                  }
                />
                <Route exact path="/api/alerts" element={<AlertsJson />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    );
  }
}

export default observer(App);
