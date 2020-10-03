import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import styled from 'styled-components';
import ItemCard from '../../presentational/shared/ItemCard';

class Give_Item_List_byUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: '',
      items: '',
    };
  }

  async componentDidMount() {
    const { axiosUrl, owner } = this.props;
    let itemsForState = {};
    let pickupList = [];
    let parentItems = {};

    console.log('Owner is ' + owner);

    this.setState({ loading: true });

    //ParentItemを全件取得してから一致するidでGive_Itemを絞り込む。
    await axios
      .all([
        axios.get(axiosUrl + 'parent/?owner=' + owner),
        axios.get(axiosUrl + 'user/' + owner),
        axios.get(axiosUrl + 'pickup/?choosingUser=' + owner),
      ])
      .then(
        axios.spread((resParent, resUser, resPickup) => {
          resParent.data.map((parentObj) => {
            parentItems = { ...parentItems, [parentObj.id]: parentObj };
          });
          resPickup.data.map((pickupObj) => {
            pickupList = [...pickupList, pickupObj];
          });
          this.setState({ user: resUser.data });
        })
      );
    console.log(parentItems);

    if (parentItems != '') {
      await Promise.all(
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
              }; // itemForState(スプレッド) closing
            } // if closing
          }) // then closing
          .catch((err) => console.log(err)) 
          // axios.get Fin

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
              })// then closing
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
        }) // map closing
      ); // Promise.all Closing
    } else {
      this.setState({ items: '商品が投稿されていません' });
    } // else closing

    // itemForStateからGiveItemのみを抽出
    for (const key in parentItems) {
      if (parentItems[key]['give_id']) {
        itemsForState = { ...itemsForState, [key]: parentItems[key] };
      }
    }
    console.log(itemsForState);

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
          ) // then closing
          .catch((err) => console.log(err));
      }) // map closing
    );// Promise all closing

    this.setState({items : itemsForState});
    console.log(this.state.items)
    this.setState({loading : false})
  }

  render() {
    const {user, items} = this.state;
    let itemCards;

    if(items === "商品が投稿されていません"){
      itemCards = <h3>{items}</h3>
    } else {
      itemCards = 
      Object.keys(this.state.items).map((parent_id, idx) => {
          return (
              <ItemCard
              key={idx}
              // リダイレクトのParameter用
              parentId={parent_id}
              name={items[parent_id]["name"]}
              bland={items[parent_id]["bland"]}
              image={items[parent_id]["image"]}
              pickups={items[parent_id]["pickups"]}
              />
          )
        })
    }

    if (this.state.loading == true) {
      return null;
    }
    return (
        <div>
            <h2>{user.username + "さんのアイテム"}</h2>
            {itemCards}
        </div>
    )
  }
}

export default Give_Item_List_byUser;
