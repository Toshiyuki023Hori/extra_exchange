import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom"
import {Link} from "react-router-dom"
import Register from "./Pages/Register"
import Top from "./Pages/Top"


function App() {
  return (
    <Router>

      <Route exact path = "/registration" component = {Register}/>
      <Route exact path = "/top" component = {Top} />

    </Router>
  );
}

export default App;
