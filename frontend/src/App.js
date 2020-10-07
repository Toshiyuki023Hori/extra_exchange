import React, { Component } from 'react';
import { Router, Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './reducks/auth/actions';
import history from './history';
import { Link } from 'react-router-dom';
import { store } from './index';
import './App.css';

import Top from './containers/Pages/Top';
import Register from './containers/Pages/Register';
import Login from './containers/Pages/Login';
import User_PickUp_Add from './containers/Pages/User_PickUp_Add';
import User_ChangePass from './containers/Pages/User_ChangePass';
import User_Edit from './containers/Pages/User_Edit';
import User_Detail from './containers/Pages/User_Detail';
import Want_Item_Add from './containers/Pages/Want_Item_Add';
import Want_Item_Edit from './containers/Pages/Want_Item_Edit';
import Give_Item_Add from './containers/Pages/Give_Item_Add';
import Give_Item_Detail from './containers/Pages/Give_Item_Detail';
import Give_Item_Edit from './containers/Pages/Give_Item_Edit';
import Request_Send from './containers/Pages/Request_Send';
import Request_Detail from "./containers/Pages/Request_Detail";
import Request_Waiting_List from "./containers/Pages/Request_Waiting_List";
import Request_Confirm from "./containers/Pages/Request_Confirm";
import Allcategories from './containers/Pages/Allcategories';

class App extends Component {
  componentDidMount() {
    // tokenがローカルに存在してるかの確認、expirationdateの期限確認
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <Router history={history}>
        {/* Route内のRoutePassはpropsを渡す役割を果たす */}
        <Switch>
          <Route
            exact
            path="/top"
            render={(routeProps) => <Top {...routeProps} {...this.props} />}
          />
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
            path="/category"
            render={(routeProps) => <Allcategories {...routeProps} {...this.props} />}
          />
          <Route
            exact
            path="/user/edit"
            render={(routeProps) => <User_Edit {...routeProps} {...this.props} />}
          />
          <Route
            exact
            path="/user/changepass"
            render={(routeProps) => <User_ChangePass {...routeProps} {...this.props} />}
          />
          <Route
            exact
            path="/user/pickup"
            render={(routeProps) => <User_PickUp_Add {...routeProps} {...this.props} />}
          />
          <Route
            exact
            path="/user/:uid"
            render={(routeProps) => <User_Detail {...routeProps} {...this.props} />}
          />
          <Route
            exact
            path="/want/add"
            render={(routeProps) => <Want_Item_Add {...routeProps} {...this.props} />}
          />
          <Route
            path="/want/edit/:parent_id"
            render={(routeProps) => <Want_Item_Edit {...routeProps} {...this.props} />}
          />
          <Route
            exact
            path="/give/add"
            render={(routeProps) => <Give_Item_Add {...routeProps} {...this.props} />}
          />
          <Route
            path="/give/detail/:parent_id"
            render={(routeProps) => <Give_Item_Detail {...routeProps} {...this.props} />}
          />
          <Route
            path="/give/edit/:parent_id"
            render={(routeProps) => <Give_Item_Edit {...routeProps} {...this.props} />}
          />
          <Route
            path="/give/request/:parent_id"
            render={(routeProps) => <Request_Send {...routeProps} {...this.props} />}
          />
          <Route
            exact
            path="/request/waiting"
            render={(routeProps) => <Request_Waiting_List {...routeProps} {...this.props} />}
          />
          <Route
            path="/request/confirm/:requestDeal_id"
            render={(routeProps) => <Request_Confirm {...routeProps} {...this.props} />}
          />
          <Route
            path="/request/:requestDeal_id"
            render={(routeProps) => <Request_Detail {...routeProps} {...this.props} />}
          />
          <Redirect to="/top" />
          {/* <Route
            render={(routeProps) => <Top {...routeProps} {...this.props} />}
          /> */}
        </Switch>
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
