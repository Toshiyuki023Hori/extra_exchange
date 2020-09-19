import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './reducks/auth/actions';
import { Link } from 'react-router-dom';
import {store} from "./index"

import Register from './containers/Pages/Register';
import Login from './containers/Pages/Login';
import Add_Want_Item from './containers/Pages/Add_Want_Item';
import Add_Give_Item from './containers/Pages/Add_Give_Item';

class App extends Component {
  componentDidMount() {
    // tokenがローカルに存在してるかの確認、expirationdateの期限確認
    this.props.onTryAutoSignup();
}

  render() {
    return (
      <Router>
        {/* Route内のRoutePassはpropsを渡す役割を果たす */}
        <Route
          exact
          path="/registration"
          render={(routeProps) => <Register {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/login"
          render={(routeProps) => <Login {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/want/add"
          render={(routeProps) => <Add_Want_Item {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/give/add"
          render={(routeProps) => <Add_Give_Item {...routeProps} {...this.props} />}
        />
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
