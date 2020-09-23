import React, { Component } from 'react';
import SmallButton from '../../presentational/shared/SmallButton';
import styled from 'styled-components';
import history from '../../history';

class User_Add_PickUp_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
        info:{
            owner :this.props.loginUser,
            plane:""
        },
        message:{
            place:""
        }
    }
  }

  render(){
      return()
  }
}

export default User_Add_PickUp_Form;
