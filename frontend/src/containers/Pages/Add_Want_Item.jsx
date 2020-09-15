import React, {Component} from 'react';

import Want_Item_Form from '../Organisms/Want_Item_Form';
import axios from 'axios';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

class Add_Want_Item extends Component {
  constructor(props){
    super(props);
    this.state= {
      owner:"",
      allBland:""
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:8000/api/user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ ...this.state, owner: res.data });
        console.log(this.state.owner);
      })
      .catch((err) => console.log(err));

    axios.get('http://localhost:8000/api/bland/').then(async (res) => {
      await this.setState({ ...this.state, allBland: res.data });
      console.log('Assignment ' + this.state.allBland);
    });
  }

  render(){
    if (this.state.owner === '' || this.state.allBland === '') {
      return <CircularProgress />;
    } else {
    return (
      <div>
        <Want_Item_Form
        name= ''
        owner= {this.state.owner}
        keyword1= ''
        keyword2= ''
        keyword3= ''
        bland= ''
        url= ''
        allBland={this.state.allBland}
        keywordUrl='http://localhost:8000/api/keyword/'
        blandUrl='http://localhost:8000/api/bland/'
        parentUrl='http://localhost:8000/api/parent/'
        wantItemUrl='http://localhost:8000/api/wantitem/'
        method="post"
        />
      </div>
    );
  }
}
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
  };
};

export default connect(mapStateToProps)(Add_Want_Item);
