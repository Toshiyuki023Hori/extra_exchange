import React, { Component } from 'react';
import axios from 'axios';

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
        <p>あなたの探し物は?</p>
        <input
          type="text"
          name="itemName"
          onChange={this.handleChange}
          value={this.state.itemName}
        />
        <button type="submit" >
          検索
        </button>
      </div>
    );
  }
}

export default SearchBox;
