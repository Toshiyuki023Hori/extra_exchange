import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div>
        <Subtitle>あなたの探し物は?</Subtitle>
        <SearchArea>
          <InputBox
            type="text"
            name="itemName"
            onChange={this.handleChange}
            value={this.state.itemName}
            placeholder="商品名で検索"
          />
          <SubmitButton type="submit">検索</SubmitButton>
        </SearchArea>
      </div>
    );
  }
}

//          ===========          ===========          ===========          ===========          ===========
//      Styled Component      =========          ===========          ===========          ===========
//          ===========          ===========          ===========          ===========          ===========

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Subtitle = styled.p`
  font-size: 18px;
  text-align: center;
  color: #6e787f;
  margin-bottom: 3px;
`;

const SearchArea = styled.div`
  text-align: center;
`;

const InputBox = styled.input`
  font-size: 17px;
  background: #d9f1ff;
  width: 80%;
  height: 55px;
  border-radius: 7px 0px 0px 7px;
  text-align: center;
`;

const SubmitButton = styled.button`
  font-size: 17px;
  background: #7caac9;
  color: white;
  width: 15%;
  height: 55px;
  text-align: center;
  border-radius: 0px 7px 7px 0px;
`;

//          ===========          ===========          ===========          ===========          ===========
//      Styled Component      =========          ===========          ===========          ===========
//          ===========          ===========          ===========          ===========          ===========

export default SearchBox;
