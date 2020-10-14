import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import styled from 'styled-components';
import ItemCard from '../../presentational/shared/ItemCard';
import { Colors } from '../../presentational/shared/static/CSSvariables';
import ReactPaginate from "react-paginate";
import "../../presentational/shared/static/Pagination.scss";

class Give_Item_List_byUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: '',
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

  async componentDidMount() {
    const { axiosUrl, owner } = this.props;
    let itemsForState = {};
    let pickupList = [];
    let parentItems = {};
    let currentItemsForState = {};

    console.log('Owner is ' + owner);

    //ParentItemを全件取得してから一致するidでGive_Itemを絞り込む。
    await axios
      .all([
        axios.get(axiosUrl + 'parent/?owner=' + owner),
        axios.get(axiosUrl + 'user/' + owner),
        axios.get(axiosUrl + 'pickup/?choosingUser=' + owner),
      ])
      .then(
        axios.spread((resParent, resUser, resPickup) => {
          if(resParent.data.length !== 0){
            resParent.data.map((parentObj) => {
              parentItems = { ...parentItems, [parentObj.id]: parentObj };
            });
            if(resPickup.data.length !== 0){
              resPickup.data.map((pickupObj) => {
                  pickupList = [...pickupList, pickupObj];
                });
            }else{
              pickupList = "未登録"
            }
          }else {
            // Want_ItemもGive_Itemも登録していないパターン
            itemsForState = "商品が投稿されていません"
          }
          this.setState({ user: resUser.data });
        })
      );

    if (Object.keys(parentItems).length !== 0) {
      await Promise.all(
        // UserのParent_ItemからGive_Itemのみを取得
        Object.keys(parentItems).map(async (parent_id) => {
          await axios.get(axiosUrl + 'giveitem/?parent_item=' + parent_id).then((res) => {
            if (res.data.length !== 0) {
              parentItems = {
                ...parentItems,
                [parent_id]: {
                  ...parentItems[parent_id],
                  give_id: res.data[0].id,
                  pickups: pickupList,
                },
              }; // parentItems(スプレッド) closing
            } //    if(res.data.length !== 0) closing
          }) //     then closing
          .catch((err) => console.log(err)) 
          //  axios.get Fin

          if(parentItems[parent_id]['bland'] !== null){
              await axios.get(axiosUrl + 'bland/?item=' + parent_id)
              .then((res) => {
                parentItems = {
                    ...parentItems,
                    [parent_id]: {
                      ...parentItems[parent_id],
                      bland:res.data[0].name
                    },
                  }; // itemForState(スプレッド) closing
              })//      then closing
              .catch((err) => console.log(err))
          } else {
            parentItems = {
                ...parentItems,
                [parent_id]: {
                  ...parentItems[parent_id],
                  bland:"なし"
                },
              }; // itemForState(スプレッド) closing
          }
        }) //       map closing
      ); //         Promise.all Closing

    // itemForStateからGiveItemのみを抽出
    for (const key in parentItems) {
      if (parentItems[key]['give_id']) {
        itemsForState = { ...itemsForState, [key]: parentItems[key] };
      }
    }
  }

    
    if(Object.keys(itemsForState).length !== 0){
      await Promise.all(
        Object.keys(itemsForState).map(async (parent_id) => {
          await axios
            .get(axiosUrl + 'image/?item=' + itemsForState[parent_id]['give_id'])
            .then(
              (res) =>
                (itemsForState = {
                  ...itemsForState,
                  [parent_id]: { ...itemsForState[parent_id], image: res.data },
                })  // itemsForState(スプレッド) closing
            ) //       then closing
            .catch((err) => console.log(err));
        }) // map closing
      );//    Promise all closing

      // ページネーションのページ数を決定
      this.setState({pageCount : Math.ceil(Object.keys(itemsForState).length) / this.state.perPage});

      // perPage分のitemsをページネーションへ
      this.setCurrentItemsForState(itemsForState);
    } else {
      // Want_Itemは登路しているが、Give_Itemは登録していないパターン。
      // Userの全Parent_Itemを取得しているため、Give_Itemの抽出を待つ必要がある。
      itemsForState = "商品が投稿されていません"
    }

    await this.setState({allItems : itemsForState});
    this.setState({loading : false})
  
}

  render() {
    const {user, allItems, pageCount,currentItems, currentPage} = this.state;
    let itemCards;
    let paginationView;

    if(allItems === "商品が投稿されていません"){
      itemCards = <NotHaveText>{allItems}</NotHaveText>
    } else {
      itemCards = 
      Object.keys(this.state.currentItems).map((parent_id, idx) => {
          return (
              <ItemCard
              key={idx}
              // リダイレクトのParameter用
              parentId={parent_id}
              name={currentItems[parent_id]["name"]}
              bland={currentItems[parent_id]["bland"]}
              image={currentItems[parent_id]["image"]}
              pickups={currentItems[parent_id]["pickups"]}
              />
          )
        });

      paginationView = 
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={<span className="gap">...</span>}
          pageCount={pageCount}
          onPageChange={this.handlePageClick}
          forcePage={currentPage}
          containerClassName={"pagination"}
          previousLinkClassName={"previous_page"}
          nextLinkClassName={"next_page"}
          disabledClassName={"disabled"}
          activeClassName={"active"}
        />
    }

    if (this.state.loading == true) {
      return null;
    }
    return (
        <Wrapper {...this.props}>
          <h2>{user.username + "さんのアイテム"}</h2>
          <ItemPlaces>
            {itemCards}
            {paginationView}
          </ItemPlaces>
        </Wrapper>
    )
  }
}

export default Give_Item_List_byUser;

const Wrapper = styled.div`
  width:100%;
  margin-top:${(props) => props.margin_top};
  margin-bottom:${(props) => props.margin_bottom};
  margin-left:${(props) => props.margin_left};
  margin-right:${(props) => props.margin_right};
  padding-bottom:30px;

  h2{
    margin-left:7px;
  }
`;

const ItemPlaces = styled.div`
  display:grid;
  grid-template-columns:1fr 1fr 1fr 1fr;
  justify-content:center;
  justify-items: center;
  grid-row-gap:25px;
  padding-top:20px;
`;

const NotHaveText = styled.p`
  grid-column: 1 / 3;
`;