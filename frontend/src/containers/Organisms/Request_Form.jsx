import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios';

class Request_Form extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
          <div>
              <div>
                  <h3>引き換える商品(出品リストより)</h3>
              </div>
          </div>
      )
  }
}

export default Request_Form;
