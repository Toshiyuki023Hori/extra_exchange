import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Register from './containers/Pages/Register';
import Login from './containers/Pages/Login';
import * as actions from './reducks/auth/actions';

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
