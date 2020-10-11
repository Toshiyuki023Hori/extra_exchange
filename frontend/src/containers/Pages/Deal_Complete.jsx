import React, { Component } from 'react';
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import axios from "axios";
import history from "../../history";
import CircularProgress from "@material-ui/core/CircularProgress";
import Header from "../Organisms/Header";

class Deal_Complete extends Component {
  constructor(props){
    super(props);
    this.state = {
        loading:true,
        loginUser:"",
        requestDeal:""
    }
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const requestDeal_id = this.props.match.params.requestDeal_id;
    let request_deal;
    let deal;
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    await axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));

    await axios.all([
        axios.get(localhostUrl + "requestdeal/" + requestDeal_id),
        axios.get(localhostUrl + "deal/?request_deal=" + requestDeal_id)
    ])
    .then(axios.spread(async (resReqDeal, resDeal) => {
        await this.setState({requestDeal : resReqDeal.data});
        deal = resDeal.data[0];
    }))
    .catch((err) => console.log(err));

    console.log(deal)
    if(deal.completed === false || 
        this.state.requestDeal.joinUser !== this.state.loginUser.id &&
        this.state.requestDeal.hostUser !== this.state.loginUser.id){
        history.push("/top");
    }
    this.setState({loading : false});
  }
  

  render() {
    let user_id;

    //loginUserじゃない方がuser_idに代入される。
    if(this.state.loginUser.id === this.state.requestDeal.joinUser){
      user_id = this.state.requestDeal.hostUser;
    }else if(this.state.loginUser.id === this.state.requestDeal.hostUser){
      user_id = this.state.requestDeal.joinUser;
    }

    if (!this.props.isAuthenticated) {
    return <Redirect to="/login" />;
    }
    if (this.state.loading == true) {
    return <CircularProgress />;
    } else {
        return (
            <div>
                <Header loginUser={this.state.loginUser}/>
                <h1>全ての取引が完了しました。</h1>
                <p>サービスをご利用いただきありがとうございました。</p>
                <a href="/category">商品を探す</a>
                <p><a href={"/user/" + user_id}>今回の取引相手の他の商品をみる</a></p>
                
            </div>
        )
    }
  }
}

export default Deal_Complete