import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import ItemCard from '../../presentational/shared/ItemCard';

class Give_Item_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loginUser: this.props.loginUser,
      items: '',
    };
  }

  async componentDidUpdate(prevProps) {
    let pickedGiveItems;
    // 各ボックスに入れる前に必要な情報をparent_idごとにまとめる
    let passParentToState = {};

    // Parent ComponentのsetStateが完了した時点で発火
    // Categoryに合ったGive_Item > Give_ItemのParent＿Item > Image, blandのUrl, name > passParentToStateからStateへ
    if (prevProps.category != this.props.category) {
      this.setState({loading : true})
      await axios
        .get(this.props.axiosUrl + 'giveitem/?category=' + this.props.category.id)
        .then((res) => {
          pickedGiveItems = res.data;
          console.log('pickedGiveItems \n' + pickedGiveItems);
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
        pickedGiveItems.map(async (giveItem) => {
          await axios
            .get(this.props.axiosUrl + 'image/?item=' + giveItem.id)
            .then((res) => {
              passParentToState = {
                ...passParentToState,
                [giveItem.parentItem]: {
                  ...passParentToState[giveItem.parentItem],
                  image: res.data,
                },
              }; // passParentToState closing tag(スプレッド構文)
              console.log(passParentToState);
            })
            .catch((err) => console.log(err));
        })
      ); // Promise all closing tag

      this.setState({ items: passParentToState });
      this.setState({loading : false})
    } // if closing tag
  } // componentDidUpdate closing

  render() {
    if (this.state.loading == true) {
      return <CircularProgress />;
    }else{
      return (
        <div>
          {
            this.state.items == "" 
            ? null
            :Object.keys(this.state.items).map((parentId) => {
              return (
                <ItemCard 
                name={this.state.items[parentId]["name"]}
                image={this.state.items[parentId]["image"]}
                bland={this.state.items[parentId]["bland"]}
                />
              )
            })
          }
        </div>
      )
    }    // else closing tag
  }    // render closing tag
}    // Give_Item_List closing tag

export default Give_Item_List;
