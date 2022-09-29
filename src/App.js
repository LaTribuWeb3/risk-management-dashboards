import "@picocss/pico";
import { observer } from "mobx-react";
import Footer from "./layout/Footer";
import Sidenav from "./layout/Sidenav";
import Header from "./layout/Header";
import SinglePage from "./pages/SinglePage";
import "./themeSwitcher";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import AlertsJson from "./API/AlertsJson";

function renderPage(props, PageComponent) {
  return <PageComponent {...props} />;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <div ref={this.scrollContainer} className="main-content">
            <Sidenav />
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
