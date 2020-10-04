import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios';

class Request_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
        joinItem:{},
        pickups:[]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { joinUser, axiosUrl } = this.props;
    let itemsForState = {};
    let pickupList = [];
    let parentItems = {};
    
    await axios
      .all([
        axios.get(axiosUrl + 'parent/?owner=' + joinUser),
        axios.get(axiosUrl + 'pickup/?choosingUser=' + joinUser),
      ])
      .then(
        axios.spread((resParent, resPickup) => {
          if(resParent.data.length !== 0){
            resParent.data.map((parentObj) => {
              parentItems = { ...parentItems, [parentObj.id]: { name : parentObj.name } };
            });
            if(resPickup.data.length !== 0){
              resPickup.data.map((pickupObj) => {
                  pickupList = [...pickupList, pickupObj];
                });
            }else{
              pickupList = "未登録"
            }
          }else {
            itemsForState = "商品が投稿されていません"
          }
        })  // axios.spread closing
      ); //    then closing
  }
  //
  //    /////    /////   ////    ComponentDidMound　終わり
  

  render() {
      return (
          <div>
              <div>
                  <h3>引き換える商品(出品リストより)</h3>
              </div>
          </div>
      )
  }
}

export default Request_Form;
