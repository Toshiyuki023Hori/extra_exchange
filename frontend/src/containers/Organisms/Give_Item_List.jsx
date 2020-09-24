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
      category: this.props.category,
    };
  }

  componentDidMount(){
      let pickedGiveItems;
      // カテゴリーに当てはまるGive_Itemを取得
      axios.get(this.props.axiosUrl + "giveitem/?category=" + this.state.category.id).then((res) => {
        pickedGiveItems = res.data;
        console.log(pickedGiveItems)
      })
      .catch((err) => console.log("そのカテゴリーに分類する商品はありません"))

      
  }

  render() {
      if(this.props.loginUser == undefined || this.props.category == undefined){
          return <CircularProgress/>
      }
    return <h1>Give_Item_List</h1>;
  }
}

export default Give_Item_List;
