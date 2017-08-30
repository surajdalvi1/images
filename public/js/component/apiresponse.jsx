import React, {Component} from 'react';
import ReactJson from 'react-json-view'
export default class Test extends React.Component {
    constructor() {
        super();
        this.state = {
            items: '',
            statusCode:''
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({items: ''});
        this.setState({statusCode: ''});
        const URL = nextProps.url;

         fetch(URL)  
          .then(result => {  
          if(result.status==200){  
            this.setState({statusCode: result.status});
            var headers=[]
            result.headers.forEach(function(val, key) { headers.push(key + ' -> ' + val) });
            this.setState({items: {"imageurl":URL,"headers":headers}});
            }else{
            this.setState({statusCode: result.status});
            result.headers.forEach(function(val, key) { console.log(key + ' -> ' + val); });
            }
          }) 
    }

    componentDidMount() {
        const URL = this.props.url;
        fetch(URL)  
          .then(result => { 
          if(result.status==200){ 
            this.setState({statusCode: result.status});
            var headers=[]
            result.headers.forEach(function(val, key) { headers.push(key + ' -> ' + val) });
            this.setState({items: {"imageurl":URL,"headers":headers}});          
             }else{
             this.setState({statusCode: result.status});
              result.headers.forEach(function(val, key) { console.log(key + ' -> ' + val); });
            }
          })  
    }

    render() {
        this.props.status(this.state.statusCode)
         var itemData =<div> <img src={this.state.items.imageurl} /><br/><b>{this.state.items.headers}</b> </div>  
        return(
            <div>
                {this.state.items ? itemData : null}
            </div>
        )

    }
}
