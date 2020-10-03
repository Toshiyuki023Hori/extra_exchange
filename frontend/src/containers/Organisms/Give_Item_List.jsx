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
    const { axiosUrl, category } = this.props;
    let pickedGiveItems;
    let owner_id;
    let pickupsObject = {};
    // 各ボックスに入れる前に必要な情報をparent_idごとにまとめる
    let itemsForState = {};

    // Parent ComponentのsetStateが完了した時点で発火
    // Categoryに合ったGive_Item > Give_ItemのParent＿Item > Image, blandのUrl, name > itemsForStateからStateへ
    if (prevProps.category != category) {
      this.setState({ loading: true });
      await axios
        .get(axiosUrl + 'giveitem/?category=' + category.id)
        .then((res) => {
          if(res.data.length === 0){
            itemsForState = "そのカテゴリーに分類する商品はありません"
          } else {
            pickedGiveItems = res.data;
          }
        })
        .catch((err) => console.log(err));

      // 以下、categoryに属する商品がヒットした場合。
      if(itemsForState !== "そのカテゴリーに分類する商品はありません"){
        // 並び順担保のために、一度別のvariableに入れてからまとめてsetStateを行う。
        // keyがParentItems.id, valueにBland等を持つオブジェクトの作成
        await Promise.all(
          pickedGiveItems.map(async (giveItem) => {
            await axios
              .get(axiosUrl + 'parent/' + giveItem.parentItem)
              .then((res) => {
                itemsForState = { ...itemsForState, [res.data.id]: { ...res.data } };
              })
              .catch((err) => console.log(err));
          })
        );
  
        //itemsForStateへblandを代入
        await Promise.all(
          Object.keys(itemsForState).map(async (parentId) => {
            if (itemsForState[parentId]['bland'] !== null) {
              await axios
                .get(axiosUrl + 'bland/' + itemsForState[parentId]['bland'])
                .then((res) => {
                  itemsForState = {
                    ...itemsForState,
                    [parentId]: { ...itemsForState[parentId], bland: res.data.name },
                  };
                })
                .catch((err) => console.log(err));
            } else {
              itemsForState = {
                ...itemsForState,
                [parentId]: { ...itemsForState[parentId], bland: 'なし' },
              };
            } // else closing
          }) // Object.keys closing
        ); // Promise.all closing
  
        // Parent_Itemのownerが登録しているPickUp_Placeを取得
        await Promise.all(
          Object.keys(itemsForState).map(async (parentId) => {
            await axios
            .get(axiosUrl + 'pickup/?choosingUser=' + itemsForState[parentId]['owner'])
              .then((res) => {
                if(res.data.length === 0){
                  pickupsObject = { ...pickupsObject, [itemsForState[parentId]['owner']]: "未登録" };
                } else {
                  pickupsObject = { ...pickupsObject, [itemsForState[parentId]['owner']]: res.data };
                }
              })
              .catch((err) => console.log(err));
          })
        );
  
        //取得したPickUp_PlaceをitemForStateオブジェクトへ代入
        await Promise.all(
          Object.keys(pickupsObject).map(async (user_id) => {
            await Object.keys(itemsForState).map((parentId) => {
              if (itemsForState[parentId]['owner'] == user_id) {
                itemsForState = {
                  ...itemsForState,
                  [parentId]: {
                    ...itemsForState[parentId],
                    pickups: pickupsObject[user_id],
                  },
                };
              }
            });
          })
        );
        console.log('Now is ' + pickupsObject)
  
        // giveItemが持つItem_ImageをitemForStateオブジェクトへ代入
        await Promise.all(
          pickedGiveItems.map(async (giveItem) => {
            await axios
              .get(axiosUrl + 'image/?item=' + giveItem.id)
              .then((res) => {
                itemsForState = {
                  ...itemsForState,
                  [giveItem.parentItem]: {
                    ...itemsForState[giveItem.parentItem],
                    image: res.data,
                  },
                }; // itemsForState closing tag(スプレッド構文)
              })
              .catch((err) => console.log(err));
          })
        ); // Promise all closing tag
      }

      console.log(itemsForState);
      this.setState({ loading: false });
      this.setState({ items: itemsForState });
    } // if closing tag
  } // componentDidUpdate closing

  render() {
    let subtitle;
    if(this.props.category){
      subtitle = <h2>{this.props.category.name + this.props.h2title}</h2>
    }

    if (this.state.loading == true) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          {subtitle}
          {this.state.items == "そのカテゴリーに分類する商品はありません"
            ? this.state.items
            : Object.keys(this.state.items).map((parentId, idx) => {
                return (
                  <ItemCard
                    key={idx}
                    parentId={parentId}
                    name={this.state.items[parentId]['name']}
                    image={this.state.items[parentId]['image']}
                    bland={this.state.items[parentId]['bland']}
                    pickups={this.state.items[parentId]['pickups']}
                  />
                );
              })}
        </div>
      );
    } // else closing tag
  } // render closing tag
} // Give_Item_List closing tag

export default Give_Item_List;
