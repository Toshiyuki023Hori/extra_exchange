import React, { Component } from 'react';
import styled from 'styled-components';
import history from '../../history';
import { Colors } from './static/CSSvariables';
import tag from '../../assets/tag.png';

class CategoryTag extends Component {
  constructor(props) {
    super(props);
    this.jumpToCategory = this.jumpToCategory.bind(this);
  }

  jumpToCategory = (category_id) => {
    history.push('/category/' + category_id);
  };

  render() {
    return (
      <Category_Div onClick={() => this.jumpToCategory(this.props.category_id)}>
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
  cursor:pointer;

  p {
    margin-left: 0.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Image = styled.img`
  height: 1.2rem;
`;
