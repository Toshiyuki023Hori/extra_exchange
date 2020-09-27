import React, { Component } from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import history from '../../history';
import { Colors } from './CSSvariables';

class ItemCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : "",
      bland: "",
      image: '',
    };
  }

  render() {
    console.log(this.props)
if (this.props.image == '' ) {
      return <CircularProgress />;
    } else {
      return (
        <Card>
          <ItemImage src={this.props.image[0]['image']} alt="" />
          <ItemName>{this.props.name}</ItemName>
          <p>Bland : {this.props.bland}
          </p>
        </Card>
      );
    }
  }
}

export default ItemCard;

const Card = styled.div`
  height: 275px;
  width: 220px;
  border-radius: 8px;
  border:2px solid ${Colors.accent2};
  overflow: scroll;
  margin: 5px 12px;
`;

const ItemImage = styled.img`
  width: 100%;
  border-radius: 8px 8px 0px 0px;
  height: 150px;
  object-fit: contain;
`;

const ItemName = styled.p`
  font-size: 1.26em;
  background: #8dd6ff;
  text-align: center;
  font-weight: bold;
`;
