import React, { Component } from 'react';
import styled from 'styled-components';
import Item_Table from '../../presentational/shared/Item_Table';
import Carousel from '../../presentational/shared/Carousel';

class Request_Description extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      h1Title,
      firstPartTitle,
      firstPart,
      secondPartTitle,
      tableItem,
      tableKey,
      swiperImages,
      pickup,
    } = this.props;
    return (
      <>
        <h1>{h1Title}</h1>
        <div>
          <h2>{firstPartTitle}</h2>
          <p>{firstPart}</p>
        </div>
        <div>
          <h2>{secondPartTitle}</h2>
          <Item_Table item={tableItem} parent_id={tableKey} />
          <Carousel images={swiperImages} />
        </div>
        <div>
          <h2>希望場所</h2>
          <p>{pickup}</p>
        </div>
      </>
    );
  }
}

export default Request_Description;
