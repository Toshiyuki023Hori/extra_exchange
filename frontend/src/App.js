import React, { Component } from 'react';
import { Router, Route, withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './reducks/auth/actions';
import history from './history';
import { Link } from 'react-router-dom';
import { store } from './index';
import './App.css';

import Register from './containers/Pages/Register';
import Login from './containers/Pages/Login';
import Want_Item_Add from './containers/Pages/Want_Item_Add';
import Want_Item_Edit from './containers/Pages/Want_Item_Edit';
import Give_Item_Add from './containers/Pages/Give_Item_Add';
import Give_Item_Edit from './containers/Pages/Give_Item_Edit';
import User_Edit from './containers/Pages/User_Edit';
import User_ChangePass from './containers/Pages/User_ChangePass';
import Top from './containers/Pages/Top';

class App extends Component {
  componentDidMount() {
    // tokenがローカルに存在してるかの確認、expirationdateの期限確認
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <Router history={history}>
        {/* Route内のRoutePassはpropsを渡す役割を果たす */}
        <Route exact path="/top" render={(routeProps) => <Top {...routeProps} {...this.props} />} />
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
        <Switch>
          <Route
            exact
            path="/want/add"
            render={(routeProps) => <Want_Item_Add {...routeProps} {...this.props} />}
          />
          <Route
            path="/want/:parent_id/edit"
            render={(routeProps) => <Want_Item_Edit {...routeProps} {...this.props} />}
          />
          <Route
            exact
            path="/give/add"
            render={(routeProps) => <Give_Item_Add {...routeProps} {...this.props} />}
          />
          <Route
            path="/give/:parent_id/edit"
            render={(routeProps) => <Give_Item_Edit {...routeProps} {...this.props} />}
          />
        </Switch>
        <Route
          path="/user/edit"
          render={(routeProps) => <User_Edit {...routeProps} {...this.props} />}
        />
        <Route
          path="/user/changepass"
          render={(routeProps) => <User_ChangePass {...routeProps} {...this.props} />}
        />
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
    uid: state.uid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
