import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import ItemCard from '../../presentational/shared/ItemCard';
import ReactPaginate from "react-paginate";
import { Wrapper, ItemPlaces } from "./Give_Item_List_byUser";

class Give_Item_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loginUser: this.props.loginUser,
      allItems: '',
      currentItems:{},
      offset:0,
      currentPage:0,
      perPage:4,
      pageCount:1,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

    // ページネーションで表示するitemをstateにセットするfunction
    setCurrentItemsForState = (items) => {
      let displayedItems;
  
      displayedItems = Object.keys(items).slice(this.state.offset, this.state.offset + this.state.perPage);
      // 1ページあたりの要素数分抜き出し
      displayedItems.map((parent_id) => {
        for (const key in items){
          if(parent_id === key){
            this.setState({currentItems : {...this.state.currentItems, [key]:items[key]}});
            continue
          }
        }
      });
    };
  
    // ページネーションで表示itemを変更させるfunction
    handlePageClick = async (data) => {
      const selectedPage = data.selected;
      const offset = selectedPage * this.state.perPage;
      await this.setState({currentPage : selectedPage, offset:offset});
      this.setState({currentItems : {}})
      this.setCurrentItemsForState(this.state.allItems);
      };

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

      // ページネーションのページ数を決定
      this.setState({pageCount : Math.ceil(Object.keys(itemsForState).length) / this.state.perPage});
      this.setCurrentItemsForState(itemsForState);
      }


      await this.setState({ allItems: itemsForState });
      this.setState({ loading: false });
    } // if closing tag
  } // componentDidUpdate closing

  render() {
    let subtitle;
    let itemCards;
    let paginationView;
    if(this.props.category){
      subtitle = <h2>{this.props.category.name + this.props.h2title}</h2>
    }

    if(this.state.allItems === "そのカテゴリーに分類する商品はありません"){
      itemCards = <h3>{this.state.allItems}</h3>;
    } else {
      itemCards = Object.keys(this.state.currentItems).map((parentId, idx) => {
        return (
          <ItemCard
            key={idx}
            parentId={parentId}
            name={this.state.currentItems[parentId]['name']}
            image={this.state.currentItems[parentId]['image']}
            bland={this.state.currentItems[parentId]['bland']}
            pickups={this.state.currentItems[parentId]['pickups']}
          />
        );
      });

      paginationView = 
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={<span className="gap">...</span>}
          pageCount={this.state.pageCount}
          onPageChange={this.handlePageClick}
          forcePage={this.state.currentPage}
          containerClassName={"pagination"}
          previousLinkClassName={"previous_page"}
          nextLinkClassName={"next_page"}
          disabledClassName={"disabled"}
          activeClassName={"active"}
        />
    }

    if (this.state.loading == true) {
      return <CircularProgress />;
    } else {
      return (
        <Wrapper>
          {subtitle}
          <ItemPlaces>
            {itemCards}
            {paginationView}
          </ItemPlaces>
        </Wrapper>
      );
    } // else closing tag
  } // render closing tag
} // Give_Item_List closing tag

export default Give_Item_List;
