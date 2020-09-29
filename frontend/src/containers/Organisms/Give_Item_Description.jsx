import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';

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
    this.setState({[key] : value})
  };

  componentDidMount() {
    const { axiosUrl, loginUser } = this.props;
    const { parentItem, giveItem, pickups } = this.state;
    const parent_id = parseInt(this.props.parent_id);


    axios
      .all([
        axios.get(axiosUrl + 'parent/' + parent_id),
        axios.get(axiosUrl + 'giveitem/?parent_item=' + parent_id),
      ])
      .then(
        axios.spread((resParent, resGive) => {
          this.setDataToState("parentItem", resParent.data);
          this.setDataToState("giveItem", resGive.data[0]);
        })
      )
      .catch((err) => console.log(err));
  }

  componentDidUpdate(prevProps, prevState){
    const {axiosUrl, loginUser} = this.props;
    const {parentItem, giveItem, pickups} = this.state;

    if(prevState.giveItem !== this.state.giveItem){
        axios.get(axiosUrl + 'category/' + this.state.giveItem.category)
        .then((res) => {
            console.log(res.data)
            this.setState({parentItem : {...parentItem, category:res.data.name}})
        });
    }
  }

  render() {
    return <h2>TEST</h2>;
  }
}

export default Give_Item_Description;
