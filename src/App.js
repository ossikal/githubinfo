import React from 'react';
import './App.css';
import Header from "./components/Header";
import Search from "./components/Search"; 
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Switch>
          <Route path="/" exact component={Search} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
