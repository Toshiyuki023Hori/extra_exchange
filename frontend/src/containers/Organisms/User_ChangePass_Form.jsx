import React, { Component } from 'react';
import styled from 'styled-components';
import history from '../../history';
import SmallButton from '../../presentational/shared/SmallButton';

class User_ChangePass_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ name: value });
  };

  render() {
    return (
      <div>
        <div>
          <label>旧パスワード</label>
          <input
            onChange={this.handleChange}
            type="password"
            name="oldPassword"
            value={this.state.oldPassword}
          />
        </div>
        <div>
          <label>新パスワード</label>
          <input
            onChange={this.handleChange}
            type="password"
            name="newPassword1"
            value={this.state.newPassword1}
          />
        </div>
        <div>
          <label>新パスワード(確認用)</label>
          <input
            onChange={this.handleChange}
            type="password"
            name="newPassword2"
            value={this.state.newPassword2}
          />
        </div>
        <SmallButton btn_name="変更" btn_type="submit" btn_click={this.handleSubmit} />
      </div>
    );
  }
}

export default User_ChangePass_Form;
