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

    if (this.state.parentItem.bland !== null) {
        axios.get(axiosUrl + 'bland/' + this.state.parentItem.bland).then((res) => {
          this.setState({ info: { ...this.state.info, bland: res.data.id } });
          this.setState({ setBland: res.data.name });
        });
      } else if (this.state.parentItem.bland === null) {
        this.setState({ info: { ...this.state.info, bland: '無し' } });
      }
  
      if (this.state.parentItem.keyword[1]) {
        fromApiToInfo('keyword/', this.state.parentItem.keyword[1], 'keyword2');
      }
  
      if (this.state.parentItem.keyword[2]) {
        fromApiToInfo('keyword/', this.state.parentItem.keyword[2], 'keyword3');
      }
  
      axios
        .get(axiosUrl + 'image/?item=' + this.state.giveItem.id)
        .then((res) => {
          res.data.map((imgObject) => {
            this.setState({
              originalImages: { ...this.state.originalImages, [imgObject['id']]: imgObject['image'] },
            });
            this.setState({
              //Submitボタンdisableの条件は、this.state.imagesなのでこちらにもset
              info: { ...this.state.info, images: [...this.state.info.images, imgObject['image']] },
            });
          });
        })
        .catch((err) => console.log(err));
    }
  }

  render(){
      return(
          <h2>This is temp change</h2>
      )
  }
}


export default Give_Item_Description;
