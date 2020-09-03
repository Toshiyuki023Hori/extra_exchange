import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom"
import {Link} from "react-router-dom"
import Register from "./Pages/Register"


function App() {
  return (
    <Router>

      <Route exact path = "/registration" component = {Register}/>

    </Router>
  );
}

export default App;
