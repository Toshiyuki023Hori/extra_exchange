import React, { Component } from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import history from '../../history';
import { Colors } from './static/CSSvariables';

class ItemCard extends Component {
  constructor(props) {
    super(props);
    this.jumpToDetail = this.jumpToDetail.bind(this);
  }

  jumpToDetail = (parentId) => {
    history.push("/give/detail/" + parentId)
  };

  render() {
    const { name, bland, image, pickups,parentId } = this.props;
    let pickupsView;
    if(pickups === "未登録"){
      pickupsView = this.props.pickups;
    } else {
      pickupsView = 
      pickups.map((pickupObj, index) => {
        if (index != pickups.length - 1) {
          return <span key={pickupObj.id}>{pickupObj.name} / </span>;
        }
        return <span key={pickupObj.id}>{pickupObj.name} </span>;
      })
    }

    if (image == '' || name == '') {
      return <CircularProgress />;
    } else {
      return (
        <Card onClick={() => this.jumpToDetail(parentId)}>
          <ItemImage  src={image[0]['image']} alt="" />
          <ItemName>{name}</ItemName>
          <ItemDescription>
            <p>Bland : {bland}</p>
            <p>
              ピックアップ : {pickupsView}
            </p>
          </ItemDescription>
        </Card>
      );
    }
  }
}

export default ItemCard;

const Card = styled.div`
  height: 295px;
  width: 230px;
  border-radius: 8px;
  border: 2px solid ${Colors.accent2};
  margin: 5px 12px;
  cursor:pointer;

  &:hover{
    transition-duration:0.2s;
    transform:scale(1.1) translate(2px, 3px) rotate(5deg);
    box-shadow:4px 5px 9px #97ABAD;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px 8px 0px 0px;
  height: 150px;
  object-fit: contain;
`;

const ItemName = styled.p`
  height:45px;
  padding:6.5px 4px;
  font-size: 1.26em;
  background: #8dd6ff;
  text-align: center;
  font-weight: bold;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
`;

const ItemDescription = styled.div`
  padding:3px 4px;
  p {
    font-size:0.86rem;
    margin-bottom:5.5px;
  }
`;
