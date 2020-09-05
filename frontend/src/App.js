import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom"
import { connect }  from "react-redux"
import {Link} from "react-router-dom"
import Register from "./Pages/Register"
import Top from "./Pages/Top"
import * as actions from "./reducks/auth/actions"


class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render(){
    return (
      <Router>
  
        <Register {...this.props}/>
        <Route exact path = "/top" component = {Top} />
  
      </Router>
    );
  }
  }

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup : () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
