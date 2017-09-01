import React, {Component} from 'react';
import ReactJson from 'react-json-view'
import axios from 'axios'
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

        axios.get(URL)
            .then(response => {
                this.setState({statusCode: response.status});
                this.setState({items: {"imageurl":URL}});
            })
            .catch((error) => {
                this.setState({statusCode: error.response.status});
                this.setState({items: {"errormessage":error.response.data}});
            });
    }

    componentDidMount() {
        const URL = this.props.url;

        axios.get(URL)
            .then(response => {
                this.setState({statusCode: response.status});
                this.setState({items: {"imageurl":URL}});
            })
            .catch((error) => {
                this.setState({statusCode: error.response.status});
                this.setState({items: {"errormessage":error.response.data}});
            });
    }

    render() {
        this.props.status(this.state.statusCode)
        var itemData;
        if(this.state.items){
            if(this.state.items.imageurl){
                itemData=<img src={this.state.items.imageurl} />
            }else{
                itemData=this.state.items.errormessage
            }
        }
        // var itemData = <img src={this.state.items.imageurl} />
        return(
            <div>
                {this.state.items ? itemData : null}
            </div>
        )

    }
}
