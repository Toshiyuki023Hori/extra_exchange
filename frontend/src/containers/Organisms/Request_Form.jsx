import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

class Request_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading:true,
        allItems:{},
        allPickup:[]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { joinUser, hostUser, axiosUrl } = this.props;
    let itemsForState = {};
    let pickupForState = [];
    let parentItems = {};
    
    await axios
      .all([
        axios.get(axiosUrl + 'parent/?owner=' + joinUser.id),
        axios.get(axiosUrl + 'pickup/?choosingUser=' + hostUser),
      ])
      .then(
        axios.spread((resParent, resPickup) => {
          if(resParent.data.length !== 0){
            resParent.data.map((parentObj) => {
              parentItems = { ...parentItems, [parentObj.id]: { name : parentObj.name } };
            });
            if(resPickup.data.length !== 0){
              resPickup.data.map((pickupObj) => {
                  pickupForState = [...pickupForState, pickupObj];
                });
            }else{
              pickupForState = "未登録"
            }
          }else {
            itemsForState = "商品が投稿されていません"
          }
        })  // axios.spread closing
      ); //    then closing

      console.log(pickupForState);
      console.log(parentItems)

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
                    give_id: res.data[0].id
                  },
                }; // itemForState(スプレッド) closing
              } //    if(res.data.length !== 0) closing
            }) //     then closing
            .catch((err) => console.log(err)) 
            //  axios.get Fin
          }) //       map closing
        ); //         Promise.all Closing
  
      // itemForStateからGiveItemのみを抽出
      for (const key in parentItems) {
        if (parentItems[key]['give_id']) {
          itemsForState = { ...itemsForState, [key]: parentItems[key] };
        }
      }
    }

    if(Object.keys(itemsForState).length !== 0 ){
      console.log("Root1")
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
    } else {
      console.log("Root2")
      itemsForState = "商品が投稿されていません"
    }


    await this.setState({allPickup : pickupForState})
    await this.setState({allItems : itemsForState});
    this.setState({loading : false})
  }
  //
  //    /////    /////   ////    ComponentDidMound　終わり
  
  handleChange = (e) => {
  
  };

  handleSubmit = () => {
  
  };

  render() {
    let itemsView;
    let pickupsView;

    if(this.state.allItems !== '商品が投稿されていません'){
      itemsView = (
        Object.keys(this.state.allItems).map((parent_id) => {
          return (
            <>
              <input name="joinItem" value={parent_id} type="radio" />
              <label>{this.state.allItems[parent_id].name}</label>
            </>
          )
        })
      )
    } else{
     itemsView = <p>{this.state.allItems}</p>
    }

    if(this.state.allPickup !== "未登録"){
      pickupsView = (
        this.state.allPickup.map((pickupObj) => {
          return (
          <>
            <input name="pickups" value={pickupObj.id} type="radio" />
            <label>{pickupObj.name}</label>
          </>
          )
        })
      )
    } else {
      pickupsView = <p>{this.state.allPickup}</p>
    }

    if(this.state.loading === true){
      return <CircularProgress/>
    } else {
      return (

          <div>
              <div>
                  <div>
                    <h3>引き換える商品(あなたの出品リストより)</h3>
                    {itemsView}
                  </div>
                  <div>
                    <h3>ピックアップ地点(出品者のピックアップ地点より)</h3>
                    {pickupsView}
                  </div>
              </div>
          </div>
      )
    }
  }
}

export default Request_Form;
