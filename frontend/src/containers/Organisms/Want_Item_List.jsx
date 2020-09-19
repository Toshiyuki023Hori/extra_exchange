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
      inKeyUrlName: '',
    };
  }

  async componentDidMount() {
    let parentItems_ids;
    let wantParentItems = {};

    await axios
      .get(this.props.axiosUrl + 'parent/?owner=' + this.state.owner)
      .then((res) => {
        this.setState({ parentItems: res.data });
        for (let i = 0; i < this.state.parentItems.length; i++) {
          parentItems_ids = {
            ...parentItems_ids,
            [this.state.parentItems[i].id]: { name: this.state.parentItems[i].name },
          };
        }
      })
      .catch((err) => console.log(err));

    await Promise.all(
      Object.keys(parentItems_ids).map(async (key) => {
        await axios.get(this.props.axiosUrl + 'wantitem/?parent_item=' + key).then((res) => {
          if (res.data.length !== 0) {
            this.setState({ wantItems: [...this.state.wantItems, res.data[0]] });
          }
        });
      })
    );

    for (const want_item of this.state.wantItems) {
      console.log('Parent is ' + want_item.parentItem);
      for (const key in parentItems_ids) {
        console.log('Key is ' + key);
        if (want_item.parentItem == key) {
          parentItems_ids = {
            ...parentItems_ids,
            [key]: { ...parentItems_ids[key], url: want_item.url },
          };
        }
      }
    }

    this.setState(this.setState({ inKeyUrlName: parentItems_ids }));
  }

  render() {
    if (
      this.state.wantItems === [] ||
      this.state.parentItems === '' ||
      this.state.inKeyUrlName === ''
    ) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <h2>{this.props.h2Title}</h2>
          <ol>
            {this.state.wantItems.length === 0
              ? null
              : Object.keys(this.state.wantItems).map((key) => {
                  return <li>{key}</li>;
                })}
          </ol>
          <button type="submit" onClick={this.consoLog}>
            Console
          </button>
        </div>
      );
    }
  }
}

export default Want_Item_List;
