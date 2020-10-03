import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import { CircularProgress, Chip } from '@material-ui/core';
import Carousel from '../../presentational/shared/Carousel';
import MiddleButton from "../../presentational/shared/MiddleButton";

class Give_Item_Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentItem: '',
      giveItem: '',
      pickups: [],
      images: [],
    };
  }

  setDataToState = (key, value) => {
    this.setState({ [key]: value });
  };

  spreadDataToObject = (spreadKey, key, value) => {
    this.setState({ [spreadKey]: { ...this.state[spreadKey], [key]: value } });
  };

  spreadDataToArray = (spreadKey, value) => {
    this.setState({ [spreadKey]: [...this.state[spreadKey], value] });
  };

  async componentDidMount() {
    const { axiosUrl, loginUser, setGiveItem } = this.props;
    const parent_id = parseInt(this.props.parent_id);

    await axios
      .all([
        axios.get(axiosUrl + 'parent/' + parent_id),
        axios.get(axiosUrl + 'giveitem/?parent_item=' + parent_id),
      ])
      .then(
        axios.spread((resParent, resGive) => {
          this.setDataToState('parentItem', resParent.data);
          this.setDataToState('giveItem', resGive.data[0]);
          setGiveItem(resGive.data[0].id)
        })
      )
      .catch((err) => console.log(err));

    axios.get(axiosUrl + 'category/' + this.state.giveItem.category).then((res) => {
      this.spreadDataToObject('giveItem', 'category', res.data.name);
    });

    if (this.state.parentItem.bland !== null) {
      axios.get(axiosUrl + 'bland/' + this.state.parentItem.bland).then((res) => {
        this.spreadDataToObject('parentItem', 'bland', res.data.name);
      });
    } else if (this.state.parentItem.bland === null) {
      this.spreadDataToObject('parentItem', 'bland', '無し');
    }

    await axios
      .all([
        axios.get(axiosUrl + 'image/?item=' + this.state.giveItem.id),
        axios.get(axiosUrl + 'pickup/?choosingUser=' + this.state.parentItem.owner),
      ])
      .then(
        axios.spread((resImages, resPickups) => {
          resImages.data.map((imageObj) => {
            this.spreadDataToArray('images', imageObj.image);
          });
          resPickups.data.map((pickupObj) => {
            this.spreadDataToArray('pickups', pickupObj.name);
          });
        })
      );
  }

  render() {
    const { parentItem, giveItem, pickups, images } = this.state;
    let editButton;
    let deleteButon;
    let pickupView;

    if(pickups.length !== 0){
      pickupView = 
        pickups.map((pickup) => {
          return <li>{pickup}</li>;
        })
    } else{
      pickupView = <li>未登録</li>
    }
    if(parentItem.owner === this.props.loginUser.id){
      editButton = 
      <MiddleButton
      btn_name="編集"
      btn_click={this.jumpToEdit}
      />
      deleteButon =
      <MiddleButton
      btn_name="削除"
      btn_click={this.handleDelete}
      />
    }
    if (images === []) {
      return <CircularProgress />;
    }
    return (
      <DescriptionWrapper>
        <Carousel images={images} />
        <div>
          <h1>{parentItem.name}</h1>
          <p>{giveItem.createdAt}に投稿</p>
          <p>状態 : {giveItem.state}</p>
          <p>ブランド : {parentItem.bland}</p>
          <p>{giveItem.detail}</p>
          <p>{giveItem.category}</p>
          <p>ピックアップ地点</p>
          <ul>
            {pickupView}
          </ul>
          {editButton}
          {deleteButon}
        </div>
      </DescriptionWrapper>
    );
  }
}

export default Give_Item_Description;

const DescriptionWrapper = styled.div`
  width: 77%;
  margin-left: auto;
  margin-right: auto;
`;
