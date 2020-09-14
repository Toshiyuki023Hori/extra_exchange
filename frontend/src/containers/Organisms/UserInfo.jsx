import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import CircularProgresss from '@material-ui/core/CircularProgress';

export default class UserInfo extends Component {
    constructor(){
        this.state = {
            loginUser = ""
        }
    }
    
    
}

const mapStateToProps = (state) => {
  return {
    uid: state.uid,
    loading: state.loading,
    error: state.error,
  };
};

export default connect(mapStateToProps)(UserInfo);
