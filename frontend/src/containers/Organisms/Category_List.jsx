import React, { Component } from 'react';
import styled from "styled-components";
import axios from "axios";

class Category_List extends Component {
  constructor(props){
    super(props);
    this.state = {
      allCategories:"",
    }
  }

  async componentDidMount(){
    const { axiosUrl } = this.props;
    await axios.get(axiosUrl + "category")
    .then((res) => { 
        this.setState({allCategories : res.data})
        // Allcategoriesの初回レンダー時に表示させるデータ。
        this.props.setCategoryToState(res.data[0]) 
    })
    .catch((err) => console.log(err));
  }

  render(){
      if(this.state.allCategories == ""){
          return null
      } else {
          return(
              <ul>
                  {this.state.allCategories.map((category) => {
                      return <li 
                      key={category.id}
                      onClick={() => this.props.setCategoryToState(category)}
                      >{category.name}</li>
                  })}
              </ul>
          )
      }
  }

}

export default Category_List