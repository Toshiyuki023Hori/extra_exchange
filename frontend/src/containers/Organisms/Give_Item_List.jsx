import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

class Give_Item_List extends Component {
constructor(props) {
  super(props);
  this.state = {
    loginUser: this.props.loginUser,
  };
}

componentDidUpdate(prevProps) {
  if(prevProps.category != this.props.category){
    let pickedGiveItems;
    axios
      .get(this.props.axiosUrl + 'giveitem/?category=' + this.props.category.id)
      .then((res) => {
        this.setState({category : res.data})
        pickedGiveItems = res.data;
        console.log(pickedGiveItems);
      })
      .catch((err) => console.log('そのカテゴリーに分類する商品はありません'));
  }
}

render() {
  if (this.state.loading == true) {
    return <CircularProgress />;
  }
  return <h1>Give_Item_List</h1>;
}
}

export default Give_Item_List;
