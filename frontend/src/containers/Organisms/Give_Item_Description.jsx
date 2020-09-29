import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';

class Give_Item_Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentItem:'',
      giveItem:'',
      pickups:[],
    }
  }

  componentDidMount(){
    const {parent_id, axiosUrl, loginUser} = this.props;
    const {parentItem, giveItem, pickups} = this.state;
    const parent_id = parseInt(parent_id);
    
    setDataToState = (key, value) => {
        this.setState({[key] : value})
    };

    await axios.all([
        axios.get(axiosUrl + 'parent/' + parent_id),
        axios.get(axiosUrl + 'giveitem/?parent_item=' + parent_id),
    ])
    .then(axios.spread((resParent, resGive) => {
        setDataToState("parentItem", resParent.data);
        setDataToState("giveItem", resGive.data[0]);
    }))
    .catch((err) => console.log(err));

    
  }

  render(){
      return()
  }
}


export default Give_Item_Description;
