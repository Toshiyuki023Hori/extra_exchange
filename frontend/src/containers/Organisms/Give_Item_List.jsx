import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

class Give_Item_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loginUser: this.props.loginUser,
    };
  }

  async componentDidUpdate(prevProps) {
    let pickedGiveItems;
    let passParentToState = {};

    if (prevProps.category != this.props.category) {
      await axios
        .get(this.props.axiosUrl + 'giveitem/?category=' + this.props.category.id)
        .then((res) => {
          pickedGiveItems = res.data;
          console.log("pickedGiveItems \n" + pickedGiveItems);
        })
        .catch((err) => console.log('そのカテゴリーに分類する商品はありません'));

      // 並び順担保のために、一度別のvariableに入れてからまとめてsetStateを行う。
      await Promise.all(
        pickedGiveItems.map(async (giveItem) => {
          await axios
            .get(this.props.axiosUrl + 'parent/' + giveItem.parentItem)
            .then((res) => {
              passParentToState = { ...passParentToState, [res.data.id]: { ...res.data } };
              console.log(passParentToState);
            })
            .catch((err) => console.log(err));
        })
      );

      await Promise.all(
        Object.keys(passParentToState).map((parentId) => {
          axios
            .get(this.props.axiosUrl + 'bland/' + passParentToState[parentId]['bland'])
            .then((res) => {
              passParentToState = {
                ...passParentToState,
                [parentId]: { ...passParentToState[parentId], bland: res.data.name },
              };
            })
            .catch((err) => console.log(err));
        }) // Object.keys closing
      ); // Promise.all closing

      await Promise.all(
        pickedGiveItems.map((giveItem) => {
          axios.get(this.props.axiosUrl + "image/?item=" + giveItem.id)
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err))
        })
      )
    } // if closing tag
  } // componentDidUpdate closing

  render() {
    if (this.state.loading == true) {
      return <CircularProgress />;
    }
    return <h1>Give_Item_List</h1>;
  }
}

export default Give_Item_List;
