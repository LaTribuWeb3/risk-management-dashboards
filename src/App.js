import '@picocss/pico'
import {observer} from "mobx-react"
import Footer from './layout/Footer'
import Sidenav from './layout/Sidenav'
import Overview from "./pages/Overview"
import Accounts from "./pages/Accounts"
import Liquidity from "./pages/Liquidity"
import Backstop from "./pages/Backstop"
import SinglePage from "./pages/SinglePage"
import './themeSwitcher'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

function renderPage (props, PageComponent) {
  return (
    <PageComponent {...props}/> 
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Sidenav/>
        <div className="main-content box-space">
            <main>
              <Routes>
                <Route exact path="/"  element={<SinglePage/>}/>
              </Routes>
            </main>
        </div>
      </div>
    </Router>
  );
}

export default observer(App);
