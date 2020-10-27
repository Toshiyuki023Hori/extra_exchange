import React, { Component } from 'react';
import styled from 'styled-components';
import Item_Table from '../../presentational/shared/Item_Table';
import Carousel from '../../presentational/shared/Carousel';
import { Colors } from '../../presentational/shared/static/CSSvariables';

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
      <div className={this.props.className}>
        <h1>{h1Title}</h1>
        <FirstPartDiv>
          <h2>{firstPartTitle}</h2>
          <p>{firstPart}</p>
        </FirstPartDiv>
        <SecondPartDiv>
          <h2>{secondPartTitle}</h2>
          <Styled_Item_Table item={tableItem} parent_id={tableKey} />
          <Carousel images={swiperImages} />
        </SecondPartDiv>
        <PickupPlaceDiv>
          <h2>希望場所</h2>
          <p>{pickup}</p>
        </PickupPlaceDiv>
      </div>
    );
  }
}

export default Request_Description;

const FirstPartDiv = styled.div`
  margin-left: 1rem;
  margin-top: 0.65rem;

  h2 {
    display: inline-block;
    position: relative;

    &::before {
      content: '';
      height: 3px;
      width: 100%;
      position: absolute;
      top: 2rem;
      background: ${Colors.subcolor1};
    }
  }

  p {
    margin-top: 0.4rem;
    margin-left: 2rem;
    font-size: 1.15rem;
  }
`;

const SecondPartDiv = styled.div`
  margin-left: 1rem;
  margin-top: 0.65rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${Colors.accent1};

  h2 {
    display: inline-block;
    position: relative;

    &::before {
      content: '';
      height: 3px;
      width: 100%;
      position: absolute;
      top: 2rem;
      background: ${Colors.subcolor1};
    }
  }
`;

const Styled_Item_Table = styled(Item_Table)`
  margin: 1rem auto;
`;

const PickupPlaceDiv = styled.div`
  margin-left: 1rem;
  margin-top: 1.5rem;

  h2 {
    display: inline-block;
    position: relative;

    &::before {
      content: '';
      height: 3px;
      width: 100%;
      position: absolute;
      top: 2rem;
      background: ${Colors.subcolor1};
    }
  }

  p {
    margin-top: 0.4rem;
    margin-left: 2rem;
    font-size: 1.15rem;
  }
`;