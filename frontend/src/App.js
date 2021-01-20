//import logo from './logo.svg';
import logo from './img/sound.png';
import React, { useState } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-fileinput/css/fileinput.min.css'
import '../node_modules/bootstrap-fileinput/css/fileinput-rtl.min.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import MainPage from "./components/main.component"
import AdvExample from "./components/example.component"
import LogOut from "./components/logout.component"
import Generate from "./components/generate.component"
import ResultPage from "./components/result.component"
import configData from "./config.json";
console.log(configData.SERVER_URL)

function App() {

  const [level, setLevel] = useState("guest");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [remain, setRemain] = useState(0);

  return (<Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <img src={logo} width="30" height="30" alt=""/> 
          <Link className="navbar-brand" to={"/"}>CommanderSong 2</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            
              {((level === "admin") | (level === "member"))?(
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                  <Link className="nav-link" to={"/example"}>Examples</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/generate"}>Generate</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/result"}>Results</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/logout"}>Logout</Link>
                  </li>
                </ul>
              ):<ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/example"}>Examples</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-in"}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                </li>
              </ul>}
          </div>
        </div>
      </nav>
      <div>
          <Switch>
            <Route exact path='/' render={props => (
              <MainPage {...props} level={level}/>
            )}/>
            <Route exact path="/example" component={AdvExample} />
            <Route exact path='/generate' render={props => (
                    <Generate {...props} level={level} account={account} remain={remain}/>
                )}/>
            <Route exact path='/result' render={props => (
                    <ResultPage {...props} level={level} account={account}/>
                )}/>
            <Route exact path='/sign-in' render={props => (
                    <Login {...props} level={level} setLevel={setLevel} account={account} setAccount={setAccount} pw={password} setPw={setPassword} setRemain={setRemain} />
                )}/>
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path='/logout' render={props => (
                    <LogOut {...props} level={level} setLevel={setLevel} account={account} setAccount={setAccount} pw={password} setPw={setPassword} setRemain={setRemain} />
                )}/>
          </Switch>
      </div>
    </div></Router>
  );
}

export default App;
