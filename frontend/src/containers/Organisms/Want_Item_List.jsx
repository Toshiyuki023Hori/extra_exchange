import React, { Component } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

class Want_Item_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: this.props.owner.id,
      loginUser: this.props.owner.id,
      parentItems: '',
      wantItems: [],
    };
  }

  async componentDidMount() {
    let parentItems_ids;

    await axios
      .get(this.props.axiosUrl + 'parent/?owner=' + this.state.owner)
      .then((res) => {
        console.log(res);
        this.setState({ parentItems: res.data });
        parentItems_ids = this.state.parentItems.map((item) => item.id);
        console.log(parentItems_ids);
      })
      .catch((err) => console.log(err));

    await Promise.all(
      parentItems_ids.map(async (item_id) => {
        await axios
          .get(this.props.axiosUrl + 'wantitem/?parent_item=' + item_id)
          .then((res) => {
            if(res.data.length !== 0){
                this.setState({ wantItems: [...this.state.wantItems, res.data[0]] });
            }
          })
          .catch((err) => console.log(err));
      })
    );

    console.log(this.state.wantItems)
  }

  render() {
    if (this.state.wantItems === [] || this.state.parentItems === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <h2>{this.props.h2Title}</h2>
          <ol>
              {
                  this.state.wantItems.length === 0 
                  ? null
                  : this.state.wantItems.map((want_item) => {
                      return (
                        <li>{want_item.parentItem}</li>
                      )
                  })
              }
          </ol>
        </div>
      );
    }
  }
}

export default Want_Item_List;
