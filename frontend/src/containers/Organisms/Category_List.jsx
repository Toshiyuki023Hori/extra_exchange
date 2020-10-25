import React, { Component } from 'react';
import styled from 'styled-components';
import history from '../../history';
import axios from 'axios';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class Category_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCategories: '',
    };
    // this.jumpToItem = this.jumpToItem.bind(this);
  }

  async componentDidMount() {
    const { axiosUrl } = this.props;
    await axios
      .get(axiosUrl + 'category')
      .then((res) => {
        this.setState({ allCategories: res.data });
      })
      .catch((err) => console.log(err));
  }

  // jumpToItem = (category_id) => {
  //   history.push("/category/" + category_id)
  //   // window.location.reload();
  // };

  render() {
    if (this.state.allCategories == '') {
      return null;
    } else {
      return (
        <div className={this.props.className}>
          <Category_Area>
            <h3>カテゴリ</h3>
            <StyledULTag>
              {this.state.allCategories.map((category) => {
                return (
                  <li key={category.id}>
                    <StyledAtag href={'/category/' + category.id}>{category.name}</StyledAtag>
                  </li>
                );
              })}
            </StyledULTag>
          </Category_Area>
        </div>
      );
    }
  }
}

export default Category_List;

const Category_Area = styled.div`
  background: ${Colors.subcolor1};
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1.8px solid ${Colors.accent2};
`;

const StyledULTag = styled.ul`
  list-style: none;

  li {
    margin-bottom: 0.7rem;
    pointer-events: none;
    padding-left: 0.5rem;
    border-radius: 0.7rem;

    &:hover {
      background: #eaf7ff;
    }
  }
`;

const StyledAtag = styled.a`
  text-decoration: none;
  color: ${Colors.characters};
  pointer-events: auto;
  display: block;
`;
