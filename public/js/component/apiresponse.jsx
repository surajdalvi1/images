import React, {Component} from 'react';
import ReactJson from 'react-json-view'
import axios from 'axios'
export default class Test extends React.Component {
    constructor() {
        super();
        this.state = {
            items: '',
            statusCode:'',
            resposneText:'',
            alldata:[]
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({items: ''});
        this.setState({statusCode: ''});
        this.setState({resposneText: ''});
        this.setState({alldata: []});
        const URL = nextProps.url;

        axios.get(URL)
            .then(response => {
                this.setState({resposneText: "Response"});
                this.setState({statusCode: response.status});
                this.setState({alldata: ["Response",response.status]});
                this.setState({items: {"imageurl":URL,"contentlength":response.headers["content-length"],"contenttype":response.headers["content-type"]}});
            })
            .catch((error) => {
                this.setState({resposneText: "Response"});
                this.setState({statusCode: error.response.status});
                this.setState({alldata: ["Response",error.response.status]});
                this.setState({items: {"errormessage":error.response.data}});
            });
    }

    componentDidMount() {
        const URL = this.props.url;

        axios.get(URL)
            .then(response => {
                this.setState({resposneText: "Response"});
                this.setState({statusCode: response.status});
                this.setState({alldata: ["Response",response.status]});
                this.setState({items: {"imageurl":URL,"contentlength":response.headers["content-length"],"contenttype":response.headers["content-type"]}});
            })
            .catch((error) => {
                this.setState({resposneText: "Response"});
                this.setState({statusCode: error.response.status});
                this.setState({alldata: ["Response",error.response.status]});
                this.setState({items: {"errormessage":error.response.data}});
            });
    }

    render() {
        /*var data=[];
        data.push(this.state.statusCode)
        data.push(this.state.resposneText)*/
        this.props.status(this.state.alldata)
        //this.props.status(this.state.resposneText)
        var itemData;
        if(this.state.items){
            if(this.state.items.imageurl){
                itemData=<div><span className='responseImage'><img src={this.state.items.imageurl}/></span><div className='responseImageHeader'><h2 className='prameterTitle'>Headers</h2><ul><li>content-length:{this.state.items.contentlength}</li><li>content-type:{this.state.items.contenttype}</li></ul></div></div>
            }else{
                itemData=<div className='errorMsg'>{this.state.items.errormessage}</div>
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
