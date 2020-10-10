import React, { Component } from 'react';
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import axios from "axios";
import history from "../../history";
import CircularProgress from "@material-ui/core/CircularProgress";

class Deal_Complete extends Component {
  constructor(props){
    super(props);
    this.state = {
        loading:true,
        loginUser:""
    }
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const requestDeal_id = this.props.match.params.requestDeal_id;
    let request_deal;
    let deal;
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));

    await axios.all([
        axios.get(localhostUrl + "requestdeal/" + requestDeal_id),
        axios.get(localhostUrl + "deal/?request_deal=" + requestDeal_id)
    ])
    .then(axios.spread((resReqDeal, resDeal) => {
        request_deal = resReqDeal.data;
        deal = resDeal.data[0].data;
    }))
    .catch((err) => console.log(err));

    if(deal.completed === false || 
       request_deal.joinUser !== this.state.loginUser.id ||
       request_deal.hostUser !== this.state.loginUser.id){
        history.push("/top");
    }
    this.setState({loading : false});
  }
  

  render() {
    if (!this.props.isAuthenticated) {
    return <Redirect to="/login" />;
    }
    if (this.state.loading == true) {
    return <CircularProgress />;
    } else {
        return (
            <div>
                <h1>全ての取引が完了しました。</h1>
            </div>
        )
    }
  }
}

export default Deal_Complete