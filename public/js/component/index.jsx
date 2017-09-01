
import Api_reponse from './apiresponse.jsx'
import config from '../../../config/default.js'
import ReactJson from 'react-json-view'
import $ from 'jquery'
var mainTitle, subTitle, entryTitle,divider,HostName;
class APIResources extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            url: "",
            api_endpoint: "",
            urlParams: [],
            globalParams: [],
            statusCode: "",
            responseBody: "",
            isLoading:false,
            rawData:''
        };
        this.getData = this.getData.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setParamsInURLByName = this.setParamsInURLByName.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log("HIIIIIIIIIIIIIIIIIIIIII")
        mainTitle = nextProps.mainTitle
        subTitle = nextProps.subTitle
        entryTitle = nextProps.entryTitle
        divider = nextProps.divider
        this.setState({urlParams:[]})
        this.setState({responseBody:""})
        this.setState({isLoading:false})
        fetch(config.host + '/content_types/console/entries/' + nextProps.entry_uid + '?api_key='+config.contentstack.api_key+'&access_token='+config.contentstack.access_token+'&environment='+config.contentstack.environment+'&include[]=code_snippets_for_different_languages.language&include[]=url_parameters.data_type&include[]=headers.type')
            .then(result=>result.json())
            .then(items=> {
                    this.setState({items: items.entry});
                    var url_string = items.entry.api_endpoint;
                    this.setState({api_endpoint: url_string})
                    this.setState({urlParams: items.entry.url_parameters})

                    var len = this.state.urlParams.length;
                    if (len > 0) {
                        var urlParameters="";
                        var updatedURL=url_string.split("?");
                        this.state.urlParams.map((item, index)=> {
                            var parameter_key = item.key
                            //added code
                            var urlParam=updatedURL[1];
                            urlParam=urlParam.split("&");
                            for(var k=0;k<urlParam.length;k++){
                                var paramKey=urlParam[k].split("=");
                                if(paramKey[0]==parameter_key){
                                    urlParameters=urlParameters+paramKey[0]+"="+item.value+"&"
                                }
                            }
                            //old code
                          /*  var key = "{" + parameter_key + "}"
                            url_string = url_string.replace(key, item.value)
                            this.setState({url: url_string})*/
                        })
                        var finalURL=updatedURL[0]+"?"+urlParameters;
                        var index_position=finalURL.lastIndexOf("&");
                        finalURL=finalURL.substring(0,index_position)
                        this.setState({url: finalURL})
                    } else {
                        this.setState({url: url_string})
                    }
                    if(items.entry){
                        $('.consoleContent').addClass('show').removeClass('hide');
                        $('.loader').addClass('hide').removeClass('show');
                    }

                }
            )
    }

    componentDidMount() {
        console.log("byeeeeeeeeeee")
        mainTitle = this.props.mainTitle
        subTitle = this.props.subTitle
        entryTitle = this.props.entryTitle
        divider = this.props.divider
        // Fetch call for global parameters
        fetch(config.host+'/content_types/global/entries?api_key='+config.contentstack.api_key+'&access_token='+config.contentstack.access_token+'&environment='+config.contentstack.environment)
            .then(result=>result.json())
            .then(obj=>{
                this.setState({globalParams: obj.entries})
            })

        // Fetch call for entry parameters and values
        fetch(config.host+'/content_types/console/entries/'+this.props.entry_uid + '?api_key='+config.contentstack.api_key+'&access_token='+config.contentstack.access_token+'&environment='+config.contentstack.environment+'&include[]=code_snippets_for_different_languages.language&include[]=url_parameters.data_type&include[]=headers.type')
            .then(result=>result.json())
            .then(items=> {
                    this.setState({items: items.entry});
                    var url_string = items.entry.api_endpoint;
                    this.setState({api_endpoint: url_string})
                    this.setState({urlParams: items.entry.url_parameters})
                    var len = this.state.urlParams.length;
                    if (len > 0) {
                        var urlParameters="";
                        var updatedURL=url_string.split("?");
                        this.state.urlParams.map((item, index)=> {
                            var parameter_key = item.key
                            //added code
                            var urlParam=updatedURL[1];
                            urlParam=urlParam.split("&");
                            for(var k=0;k<urlParam.length;k++){
                                var paramKey=urlParam[k].split("=");
                                if(paramKey[0]==parameter_key){
                                    urlParameters=urlParameters+paramKey[0]+"="+item.value+"&"
                                }
                            }
                            //old code
                  /*          var key = "{" + parameter_key + "}"
                            url_string = url_string.replace(key, item.value)
                            //this.setState({url: url_string})*/
                        })
                        var finalURL=updatedURL[0]+"?"+urlParameters;
                        var index_position=finalURL.lastIndexOf("&");
                        finalURL=finalURL.substring(0,index_position)
                        this.setState({url: finalURL})
                    } else {
                        this.setState({url: url_string})
                    }


                    if(items.entry){
                        $('.consoleContent').addClass('show').removeClass('hide');
                        $('.loader').addClass('hide').removeClass('show');
                    }
                }
            )
        $(".closeBtn , .slide-arrow").on("click",function(){
            $('.sideColumExampleConsole').animate({
                right: -700
            });
            $("#main").removeClass("content-slide");
            $(".slide-arrow").removeClass("show");
        });

        $('.scrollbar').scroll(function() {
            if ($('.scrollbar').scrollTop() > 0) {
                $(".breadcrum").addClass("dark");
            } else{
                $(".breadcrum").removeClass("dark");
            }
        });

        $('.closeBtn').on("click",function(){
            $(".breadcrum").removeClass("dark");
        });

        $(".raw").on('click', function () {
            $(this).addClass('act').siblings('.pretty').removeClass('act');
            $(this).parents('.responseHead').siblings('#scroll_sec').find('.rawData').show().siblings('.prettData').hide();
        });
        $(".pretty").on('click', function () {
            $(this).addClass('act').siblings('.raw').removeClass('act');
            $(this).parents('.responseHead').siblings('#scroll_sec').find('.prettData').show().siblings('.rawData').hide();
        });

    }

    getData(value) {
        if (value) {
            this.setState({isLoading: false})
            this.setState({statusCode: value})
        }
    }
    onClick() {
        this.setState({isLoading: true});
        this.setState({statusCode: ''});
        this.setState({rawData: ''});
        var url = HostName + this.state.url;
        this.state.responseBody = <Api_reponse status={this.getData} url={url}/>
        this.forceUpdate();
    }


    setParamsInURLByName(name, value) {
        var sURL = this.state.url;
        var old_url = this.state.api_endpoint;
        var arrParams = sURL.split("?");
        var main = old_url.split("?")
        var new_index = arrParams[0].split("/")
        var old_index = main[0].split("/")
        var final_index = old_index.indexOf("{" + name + "}")
        if (final_index) {
            new_index[final_index] = value;
            var final_url = new_index.join("/")
            arrParams[0] = final_url;
            var last_url = arrParams.join("?")
            this.setState({url: last_url})
        }
        var arrURLParams = arrParams[1].split("&");
        for (var i = 0; i < arrURLParams.length; i++) {
            var sParam = arrURLParams[i].split("=");
            if (sParam[0] == name) {
                var old_value = sParam[1];
                sURL = sURL.replace(sParam[0]  + '=' + old_value, sParam[0]  + '=' + value)
                this.setState({url: sURL})

            }
        }
    }

    onChange(event) {
        var name = event.target.name;
        var value = event.target.value;
        this.setParamsInURLByName(name, value);
        this.forceUpdate();
    }

    render() {
        const renderHTML = (escapedHTML:string) => React.createElement("div", {dangerouslySetInnerHTML: {__html: escapedHTML}});
        var itemsData = this.state.items;
        var isLoading = this.state.isLoading;
        var parameters, global, parametersINFO,headers,headersParam;
        var method = itemsData.method;
        var url = itemsData.api_endpoint;

        // mapping for global parameter
        if(this.state.globalParams){
            global = this.state.globalParams.map((param, index) => {
                if(param.title == "Host"){
                    HostName = param.value
                    return (HostName)
                }
            })
        }
        if (itemsData.url_parameters) {
            parametersINFO = this.state.urlParams.map((item, index) => {
                return (
                    <div key={index} className="consoleKitRow">
                        <div className="pull-left parameterText">{item.key}<span>{item.required_parameter ? "(required)" : "(optional)" }</span>
                        </div>
                        <div className="pull-left Inputfield"><input type="text" className="parameterInput" name={item.key}
                                                                     placeholder="null" defaultValue={item.value} onChange={this.onChange}/></div>
                    </div>
                )
            })
            parameters = this.state.urlParams.map((item, index) => {
                return (

                    <li key={index} className="parameter required">
                        <div className="parameterRow">
                            <div className="parameterColumn parameterKeyColumn">
                                <div className="parameterKey">{item.key} <span
                                    className="">{item.required_parameter ? "(required)" : "(optional)" }</span>
                                </div>
                            </div>

                            <div className="parameterColumn parameterDescriptionColumn">
                                <div className="parameterDescription">
                                    <p>{renderHTML(item.description)}</p>
                                    <em className="parameterExampleText">Example: <code
                                        className="parameterExampleValue">{item.value}</code></em>
                                </div>
                            </div>

                        </div>
                    </li>
                )
            })
        }
        return (
            <div className="docColum">
                <div className="show loader">
                    <span id="loaderr"></span>
                </div>
                <div className="hide consoleContent">
                    <div className="breadcrum col-md-12">
                        <span id="slide" className="closeBtn pullLeft">X</span>
                        <div className="breadcrumContainer">
                            <span>{mainTitle}</span>
                            <span className="divider">{divider}</span>
                            <span>{subTitle}</span>
                            <span className="divider">{divider}</span>
                            <span>{entryTitle}</span>
                        </div>
                    </div>

                    <div className="breadCrumColum col-md-12">
                        <div className="link"><p><span className="get font">{itemsData.method}</span>
                            {HostName}{this.state.api_endpoint}</p>
                        </div>
                    </div>

                    <div className="parametersColumTable  col-md-12 ">
                        <h2 className="prameterTitle font ">Parameters</h2>
                        <ul className="parametersList">
                            {parameters}
                        </ul>
                    </div>

                    <div className="requestColum  col-md-12">
                        <h2 className="prameterTitle font ">Request</h2>
                        <div className="link"><p><span className="get font">{itemsData.method}</span>
                            {HostName}{this.state.url}
                        </p>
                        </div>
                        <div className="requstPrmterContainer">
                            <div className="requstPrmterColum">
                                <ul className="requstPrmtermenu">
                                    <li className="current"><a href="#tab-1">URI Parameters</a></li>
                                </ul>
                            </div>
                            <div className="prameters-row">
                                {parametersINFO}
                            </div>
                            <div className="btns-container">
                                <button className="callResorcBtn" bsStyle="primary" disabled={isLoading}
                                        onClick={()=> this.onClick()}> {isLoading ? 'Trying...' : 'Try'} </button>
                            </div>
                        </div>

                        <div className="responseColm">
                            <div className="responseHead">
                                <h2 className="prameterTitle">Response <span className=""> {this.state.statusCode} </span></h2>
                                
                                
                            </div>
                            <div id="scroll_sec">
                                <div className="responseBox">
                                     {this.state.responseBody? this.state.responseBody : <img src={'https://dev-images.contentstack.io/v3/assets/blt178f5ddafe90ae36/blt655974c6de1bd78c/59a8edb86080ca11663b7c8f/download'} />}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function loadReactDom() {
    var mainTitle = this.getAttribute('mainTitle')
    var subTitle = this.getAttribute('subTitle')
    var entryTitle = this.getAttribute('entryTitle')
    var entryUid = this.getAttribute('entryUid')
    var divider ='/';
    // console.log(this.props)
    $('.consoleContent').addClass('hide').removeClass('show');
    $('.loader').addClass('show').removeClass('hide');
    $('.actionName').on("click",function(){
        $(".breadcrum").removeClass("dark");
    });
    var rightBox = $('.sideColumExampleConsole');
    rightBox.animate({
        right: 0
    },function() {
        ReactDOM.render(
            <APIResources mainTitle={mainTitle} subTitle={subTitle} entryTitle={entryTitle} entry_uid={entryUid}
                          divider={divider}/>,
            document.getElementById('documentationColum')
        );
    });
}

var button = document.getElementsByClassName('actionName');
for (var i = 0; i < button.length; i++) {
    button[i].addEventListener('click', loadReactDom);
}