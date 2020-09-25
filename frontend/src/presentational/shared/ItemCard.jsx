import React, { Component } from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import history from '../../history';

class ItemCard extends Component {
  constructor(props) {
    super(props);
    this.state={
        image:""
    }
  }

  render() {
      if(this.props.image == ""){
          return <CircularProgress/>
      }
      else{
          return (
            <Card>
              <Image src={this.props.image[0]["image"]} alt=""/>
              <p>{this.props.name}</p>
              <p>{this.props.bland}</p>
            </Card>
          );
      }
  }
}

export default ItemCard;

const Card = styled.div`
    height:300px;
    width:180px;
`;

const Image = styled.img`
    width:178px;
`;