import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors } from './static/CSSvariables';
import tag from '../../assets/tag.png';

class CategoryTag extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Category_Div>
        <Image src={tag} alt="タグマーク" />
        <p>{this.props.category_name}</p>
      </Category_Div>
    );
  }
}

export default CategoryTag;

const Category_Div = styled.div`
  background-color: ${Colors.main};
  color: ${Colors.accent2};
  width: 13rem;
  display: flex;
  align-items: center;
  padding: 0.4rem;
  border-radius: 0.77rem;

  p{
      margin-left:0.4rem;
  }
`;

const Image = styled.img`
  height: 1.2rem;
`;
