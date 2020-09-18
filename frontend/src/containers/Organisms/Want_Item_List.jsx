import React, { Component } from 'react'
import axios from "axios"
import CircularProgress from "@material-ui/core/CircularProgress"

class Want_Item_List extends Component{
  constructor(props){
      super(props);
      this.state = {
          owner : this.props.owner.id,
          loginUser: this.props.owner.id,
          parentItems:[]
      }
    }

      componentDidMount() {
        // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
        axios
          .get(this.props.axiosUrl+ 'parent/' + "?owner=" + this.state.owner)
          .then((res) => {
            this.setState({parentItems: [...this.state.parentItems, res.data ]});
            console.log(this.state.parentItems);
          })
          .catch((err) => console.log(err));
  }


  render(){
      return(
      <div>
          <h2>{this.props.h2Title}</h2>
          
          <ol>
              {this.state.parentItems.filter((item) => item.want_item)}
          </ol>
      </div>
      
      )
  }

}

export default Want_Item_List