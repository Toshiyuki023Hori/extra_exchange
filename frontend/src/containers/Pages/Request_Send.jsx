import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import Item_Table from '../../presentational/shared/Item_Table';
import Request_Form from '../Organisms/Request_Form';

class Request_Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginUser: '',
      hostItem: {},
      hostUser: '',
    };
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    let itemsForState = {};
    const parent_id = this.props.match.params.parent_id;
    const setValueToItems = (id, key, value) => {
      itemsForState = {
        [id]: {
          ...itemsForState[id],
          [key]: value
        },
      };
    };

    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    await axios
      .all([
        axios.get(localhostUrl + 'user/' + localStorage.getItem('uid')),
        axios.get(localhostUrl + 'parent/' + parent_id),
      ])
      .then(
        axios.spread((resUser, resParent) => {
          this.setState({ loginUser: resUser.data });
          itemsForState = { [parent_id]: resParent.data };
          // Request_FormでPropsとして渡す用(後にidからstringへ変換するため別個にvariableを用意。)。
          this.setState({ hostUser: resParent.data.owner });
        })
      );

    await axios
      .get(localhostUrl + 'giveitem/?parent_item=' + parent_id)
      .then((res) =>{
        setValueToItems(parent_id, "give_id", res.data[0].id)
        setValueToItems(parent_id, 'state', res.data[0].state,)
        setValueToItems(parent_id, 'category', res.data[0].category,)
        setValueToItems(parent_id, 'detail', res.data[0].detail)
      }
      )
      .catch((err) => console.log(err));

    await axios
      .get(localhostUrl + 'user/' + itemsForState[parent_id].owner)
      .then((res) => setValueToItems(parent_id, 'owner', res.data.username))
      .catch((err) => console.log(err));

    await axios
      .get(localhostUrl + 'category/' + itemsForState[parent_id].category)
      .then((res) => setValueToItems(parent_id, 'category', res.data.name))
      .catch((err) => console.log(err));

    if (itemsForState[parent_id].bland !== null) {
      await axios
        .get(localhostUrl + 'bland/' + itemsForState[parent_id].bland)
        .then((res) => setValueToItems(parent_id, 'bland', res.data.name))
        .catch((err) => console.log(err));
    } else {
      setValueToItems(parent_id, 'bland', 'なし');
    }

    await this.setState({ hostItem: itemsForState });
    this.setState({ loading: false });
  }

  render() {
    const parent_id = this.props.match.params.parent_id;
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.state.loading === true) {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          <Item_Table item={this.state.hostItem} parent_id={this.props.match.params.parent_id} />
          <Request_Form
            joinUser={this.state.loginUser}
            hostUser={this.state.hostUser}
            hostItem={this.props.match.params.parent_id}
            axiosUrl="http://localhost:8000/api/"
          />
        </>
      );
    }
  }
}

export default Request_Send;
