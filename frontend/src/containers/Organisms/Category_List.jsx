import React, { Component } from 'react';
import styled from "styled-components";
import history from "../../history";
import axios from "axios";

class Category_List extends Component {
  constructor(props){
    super(props);
    this.state = {
      allCategories:"",
    }
    this.jumpToItem = this.jumpToItem.bind(this);
  }

  async componentDidMount(){
    const { axiosUrl } = this.props;
    await axios.get(axiosUrl + "category")
    .then((res) => { 
        this.setState({allCategories : res.data})
    })
    .catch((err) => console.log(err));
  }

  jumpToItem = (category_id) => {
    history.push("/category/" + category_id)
    // window.location.reload();
  };

  render(){
      if(this.state.allCategories == ""){
          return null
      } else {
          return(
              <ul>
                  {this.state.allCategories.map((category) => {
                      return <li 
                      key={category.id}
                      onClick={() => this.jumpToItem(category.id)}
                      >{category.name}</li>
                  })}
              </ul>
          )
      }
  }

}

export default Category_List